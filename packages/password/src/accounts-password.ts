import { 
  CreateUser,
  User,
  Login,
  EmailRecord,
  TokenRecord,
  DatabaseInterface,
  AuthenticationService,
  ConnectionInformations,
  Message
} from '@accounts/types';
import { trim, isEmpty, isFunction, isString, isPlainObject, get, find, includes } from 'lodash';
import { HashAlgorithm } from '@accounts/common';
import { TwoFactor, AccountsTwoFactorOptions } from '@accounts/two-factor';
import { AccountsServer, getFirstUserEmail } from '@accounts/server';
import { hashPassword, bcryptPassword, verifyPassword } from './utils/encryption';

import { PasswordCreateUserType } from './types/password-create-user-type';
import { PasswordLoginType } from './types/password-login-type';
import { PasswordType } from './types/password-type';

import { isEmail } from './utils/isEmail';

export interface AccountsPasswordOptions {
  twoFactor?: AccountsTwoFactorOptions;
  passwordHashAlgorithm?: HashAlgorithm;
  passwordResetTokenExpirationInDays?: number;
  passwordEnrollTokenExpirationInDays?: number;
  minimumPasswordLength?: number;
  validateNewUser?: (user: CreateUser) => Promise<boolean>;
  validateEmail?(email?: string): boolean;
  validatePassword?(password?: PasswordType): boolean;
  validateUsername?(username?: string): boolean;
}

const defaultOptions = {
  passwordResetTokenExpirationInDays: 3,
  passwordEnrollTokenExpirationInDays: 30,
  minimumPasswordLength: 7,
  validateEmail(email?: string): boolean {
    const isValid = !isEmpty(trim(email || '')) && isEmail(email);
    return Boolean(isValid);
  },
  validatePassword(password?: PasswordType): boolean {
    const isValid = !isEmpty(password);
    return isValid;
  },
  validateUsername(username?: string): boolean {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    const isValid = username && !isEmpty(trim(username)) && usernameRegex.test(username);
    return Boolean(isValid);
  },
};

export default class AccountsPassword implements AuthenticationService {
  public serviceName = 'password';
  public server: AccountsServer;
  public twoFactor: TwoFactor;
  private options: AccountsPasswordOptions;
  private db: DatabaseInterface;

  private firewall: string[] = [
    'authenticate',
    'createUser',
    'sendEnrollmentEmail',
    'sendResetPasswordEmail',
    'sendVerificationEmail',
    'resetPassword',
    'twoFactor'
  ]

  constructor(options: AccountsPasswordOptions = {}) {
    this.options = { ...defaultOptions, ...options };
    this.twoFactor = new TwoFactor(options.twoFactor);
  }

  public link = (accountsServer: AccountsServer): ThisType<AuthenticationService> => {
    this.server = accountsServer;
    this.db = accountsServer.db;
    return this;
  }

  public setStore(store: DatabaseInterface) {
    this.db = store;
    this.twoFactor.setStore(store);
  }

  public useService(target: any, params: any, connectionInfo: ConnectionInformations): Promise<object> {
    const actionName: string = target.action;
    if(!actionName) { 
      throw new Error('no action specified')
    }
    const actionNameSafe: string = this.firewall.find(safeAction => actionName === safeAction)
    if(!actionNameSafe) {
      throw new Error('the action is not allowed')
    }
    return this[actionNameSafe](params, connectionInfo)
  }

  public async authenticate(params: PasswordLoginType, connectionInfo: ConnectionInformations): Promise<User> {
    const { user, password, code } = params;
    if (!user || !password) {
      throw new Error('Unrecognized options for login request');
    }
    if ((!isString(user) && !isPlainObject(user)) || !isString(password)) {
      throw new Error('Match failed');
    }

    const foundUser = await this.passwordAuthenticator(user, password);

    // If user activated two factor authentication try with the code
    if (this.twoFactor.getUserService(foundUser)) {
      await this.twoFactor.authenticate(foundUser, code);
    }

    return foundUser;
  }

  /**
   * @description Marks the user's email address as verified.
   * @param {string} token - The token retrieved from the verification URL.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async verifyEmail({ token } : { token: string }): Promise<Message> {
    const user = await this.db.findUserByEmailVerificationToken(token);
    if (!user) {
      throw new Error('Verify email link expired');
    }

    const verificationTokens: TokenRecord[] = get(
      user,
      ['services', 'email', 'verificationTokens'],
      []
    );
    const tokenRecord = find(verificationTokens, (t: TokenRecord) => t.token === token);
    if (!tokenRecord) {
      throw new Error('Verify email link expired');
    }
    // TODO check time for expiry date
    const emailRecord = find(user.emails, (e: EmailRecord) => e.address === tokenRecord.address);
    if (!emailRecord) {
      throw new Error('Verify email link is for unknown address');
    }
    await this.db.verifyEmail(user.id, emailRecord.address);
    return { message: 'Email verified' }
  }

  /**
   * @description Reset the password for a user using a token received in email.
   * @param {string} token - The token retrieved from the reset password URL.
   * @param {string} newPassword - A new password for the user.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async resetPassword({ token, newPassword } : { token: string, newPassword: PasswordType }): Promise<Message> {
    const user = await this.db.findUserByResetPasswordToken(token);
    if (!user) {
      throw new Error('Reset password link expired');
    }

    // TODO move this getter into a password service module
    const resetTokens = get(user, ['services', 'password', 'reset']);
    const resetTokenRecord = find(resetTokens, t => t.token === token);

    if (this.server.tokenManager.isEmailTokenExpired(token, resetTokenRecord)) {
      throw new Error('Reset password link expired');
    }

    const emails = user.emails || [];
    if (!includes(emails.map((email: EmailRecord) => email.address), resetTokenRecord.address)) {
      throw new Error('Token has invalid email address');
    }

    const password = await this.hashAndBcryptPassword(newPassword);
    // Change the user password and remove the old token
    await this.db.setResetPassword(user.id, resetTokenRecord.address, password, token);
    // Changing the password should invalidate existing sessions
    this.db.invalidateAllSessions(user.id);
    return {message: 'Password Changed'}
  }

  /**
   * @description Send an email with a link the user can use verify their email address.
   * @param {string} [address] - Which address of the user's to send the email to.
   * This address must be in the user's emails list.
   * Defaults to the first unverified email in the list.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async sendVerificationEmail({ address }: { address: string }): Promise<Message> {
    if (!address) {
      throw new Error('Invalid email');
    }
    const user = await this.db.findUserByEmail(address);
    if (!user) {
      throw new Error('User not found');
    }
    // Make sure the address is valid
    const emails = user.emails || [];
    if (!address || !includes(emails.map(email => email.address), address)) {
      throw new Error('No such email address for user');
    }
    const token = this.server.tokenManager.generateRandomToken();
    await this.db.addEmailVerificationToken(user.id, address, token);

    const resetPasswordMail = this.server.prepareMail(
      address,
      token,
      this.server.sanitizeUser(user),
      'verify-email',
      this.server.options.emailTemplates.verifyEmail,
      this.server.options.emailTemplates.from
    );

    await this.server.options.sendMail(resetPasswordMail);
    return { message: 'Email Sent' }
  }

  /**
   * @description Send an email with a link the user can use to reset their password.
   * @param {string} [address] - Which address of the user's to send the email to.
   * This address must be in the user's emails list.
   * Defaults to the first email in the list.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async sendResetPasswordEmail({ address }: { address: string }): Promise<Message> {
    if (!address) {
      throw new Error('Invalid email');
    }
    const user = await this.db.findUserByEmail(address);
    if (!user) {
      throw new Error('User not found');
    }
    address = getFirstUserEmail(user, address);
    const token = this.server.tokenManager.generateRandomToken();
    await this.db.addResetPasswordToken(user.id, address, token);

    const resetPasswordMail = this.server.prepareMail(
      address,
      token,
      this.server.sanitizeUser(user),
      'reset-password',
      this.server.options.emailTemplates.resetPassword,
      this.server.options.emailTemplates.from
    );

    await this.server.options.sendMail(resetPasswordMail);
    return { message: 'Email sent' }
  }

  /**
   * @description Send an email with a link the user can use to set their initial password.
   * @param {string} [address] - Which address of the user's to send the email to.
   * This address must be in the user's emails list.
   * Defaults to the first email in the list.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async sendEnrollmentEmail({ address }: { address: string }): Promise<Message> {
    const user = await this.db.findUserByEmail(address);
    if (!user) {
      throw new Error('User not found');
    }
    address = getFirstUserEmail(user, address);
    const token = this.server.tokenManager.generateRandomToken();
    await this.db.addResetPasswordToken(user.id, address, token, 'enroll');

    const enrollmentMail = this.server.prepareMail(
      address,
      token,
      this.server.sanitizeUser(user),
      'enroll-account',
      this.server.options.emailTemplates.enrollAccount,
      this.server.options.emailTemplates.from
    );

    await this.server.options.sendMail(enrollmentMail);
    return { message: 'Email Sent' }
  }

  /**
   * @description Create a new user.
   * @param user - The user object.
   * @returns Return the id of user created.
   */
  public async createUser(user: PasswordCreateUserType): Promise<string> {
    if (!this.options.validateUsername(user.username) && !this.options.validateEmail(user.email)) {
      throw new Error('Username or Email is required');
    }

    if (user.username && (await this.db.findUserByUsername(user.username))) {
      throw new Error('Username already exists');
    }

    if (user.email && (await this.db.findUserByEmail(user.email))) {
      throw new Error('Email already exists');
    }

    let password;
    if (user.password) {
      if (!this.options.validatePassword(user.password)) {
        throw new Error('Invalid password');
      }
      password = await this.hashAndBcryptPassword(user.password);
    }

    const proposedUserObject = {
      username: user.username,
      email: user.email && user.email.toLowerCase(),
      password,
      profile: user.profile,
    };

    const { validateNewUser } = this.options;
    if (isFunction(validateNewUser) && !await validateNewUser(proposedUserObject)) {
      throw new Error('User invalid');
    }

    return this.db.createUser(proposedUserObject);
  }

  private async passwordAuthenticator(
    user: string | Login,
    password: PasswordType
  ): Promise<User> {
    const { username, email, id } = isString(user)
      ? this.toUsernameAndEmail({ user })
      : this.toUsernameAndEmail({ ...user });

    let foundUser: User;

    if (id) {
      // this._validateLoginWithField('id', user);
      foundUser = await this.db.findUserById(id);
    } else if (username) {
      // this._validateLoginWithField('username', user);
      foundUser = await this.db.findUserByUsername(username);
    } else if (email) {
      // this._validateLoginWithField('email', user);
      foundUser = await this.db.findUserByEmail(email);
    }

    if (!foundUser) {
      throw new Error('User not found');
    }

    const hash = await this.db.findPasswordHash(foundUser.id);
    if (!hash) {
      throw new Error('User has no password set');
    }

    const hashAlgorithm = this.options.passwordHashAlgorithm;
    const pass: any = hashAlgorithm ? hashPassword(password, hashAlgorithm) : password;
    const isPasswordValid = await verifyPassword(pass, hash);

    if (!isPasswordValid) {
      throw new Error('Incorrect password');
    }

    return foundUser;
  }

  private async hashAndBcryptPassword(password: PasswordType): Promise<string> {
    const hashAlgorithm = this.options.passwordHashAlgorithm;
    const hashedPassword: any = hashAlgorithm ? hashPassword(password, hashAlgorithm) : password;
    return bcryptPassword(hashedPassword);
  }

  /**
   * Given a username, user and/or email figure out the username and/or email.
   *
   * @param user An object containing at least `username`, `user` and/or `email`.
   * @returns An object containing `id`, `username` and `email`.
   */
  private toUsernameAndEmail({ user, username, email, id }: any): any {
    if (user && !username && !email) {
      if (isEmail(user)) {
        email = user;
        username = null;
      } else {
        username = user;
        email = null;
      }
    }
    return { username, email, id };
  }
}
