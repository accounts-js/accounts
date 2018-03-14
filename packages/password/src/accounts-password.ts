import {
  trim,
  isEmpty,
  isFunction,
  isString,
  isPlainObject,
  get,
  find,
  includes,
} from 'lodash';
import {
  CreateUserType,
  UserObjectType,
  HashAlgorithm,
  LoginUserIdentityType,
  EmailRecord,
  TokenRecord,
} from '@accounts/common';
import {
  DBInterface,
  AccountsServer,
  generateRandomToken,
  AuthService,
} from '@accounts/server';
import { TwoFactor, AccountsTwoFactorOptions } from '@accounts/two-factor';
import { getFirstUserEmail } from '@accounts/server/lib/utils';
import { hashPassword, bcryptPassword, verifyPassword } from './encryption';
import {
  PasswordCreateUserType,
  PasswordLoginType,
  PasswordType,
} from './types';

export const isEmail = (email?: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email && re.test(email);
};

export interface AccountsPasswordOptions {
  twoFactor?: AccountsTwoFactorOptions;
  passwordHashAlgorithm?: HashAlgorithm;
  passwordResetTokenExpirationInDays?: number;
  passwordEnrollTokenExpirationInDays?: number;
  minimumPasswordLength?: number;
  validateNewUser?: (user: CreateUserType) => Promise<boolean>;
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
    const isValid =
      username && !isEmpty(trim(username)) && usernameRegex.test(username);
    return Boolean(isValid);
  },
};

export default class AccountsPassword implements AuthService {
  public serviceName = 'password';
  public server: AccountsServer;
  public twoFactor: TwoFactor;
  private options: AccountsPasswordOptions;
  private db: DBInterface;

  constructor(options: AccountsPasswordOptions = {}) {
    this.options = { ...defaultOptions, ...options };
    this.twoFactor = new TwoFactor(options.twoFactor);
  }

  public setStore(store: DBInterface) {
    this.db = store;
    this.twoFactor.setStore(store);
  }

  public async authenticate(
    params: PasswordLoginType
  ): Promise<UserObjectType> {
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
   * @description Find a user by one of his emails.
   * @param {string} email - User email.
   * @returns {Promise<Object>} - Return a user or null if not found.
   */
  public findUserByEmail(email: string): Promise<UserObjectType | null> {
    return this.db.findUserByEmail(email);
  }

  /**
   * @description Find a user by his username.
   * @param {string} username - User username.
   * @returns {Promise<Object>} - Return a user or null if not found.
   */
  public findUserByUsername(username: string): Promise<UserObjectType | null> {
    return this.db.findUserByUsername(username);
  }

  /**
   * @description Add an email address for a user.
   * Use this instead of directly updating the database.
   * @param {string} userId - User id.
   * @param {string} newEmail - A new email address for the user.
   * @param {boolean} [verified] - Whether the new email address should be marked as verified.
   * Defaults to false.
   * @returns {Promise<void>} - Return a Promise.
   */
  public addEmail(
    userId: string,
    newEmail: string,
    verified: boolean
  ): Promise<void> {
    // TODO use this.options.verifyEmail before
    return this.db.addEmail(userId, newEmail, verified);
  }

  /**
   * @description Remove an email address for a user.
   * Use this instead of directly updating the database.
   * @param {string} userId - User id.
   * @param {string} email - The email address to remove.
   * @returns {Promise<void>} - Return a Promise.
   */
  public removeEmail(userId: string, email: string): Promise<void> {
    return this.db.removeEmail(userId, email);
  }

  /**
   * @description Marks the user's email address as verified.
   * @param {string} token - The token retrieved from the verification URL.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async verifyEmail(token: string): Promise<void> {
    const user = await this.db.findUserByEmailVerificationToken(token);
    if (!user) {
      throw new Error('Verify email link expired');
    }

    const verificationTokens: TokenRecord[] = get(
      user,
      ['services', 'email', 'verificationTokens'],
      []
    );
    const tokenRecord = find(
      verificationTokens,
      (t: TokenRecord) => t.token === token
    );
    if (!tokenRecord) {
      throw new Error('Verify email link expired');
    }
    // TODO check time for expiry date
    const emailRecord = find(
      user.emails,
      (e: EmailRecord) => e.address === tokenRecord.address
    );
    if (!emailRecord) {
      throw new Error('Verify email link is for unknown address');
    }
    await this.db.verifyEmail(user.id, emailRecord.address);
  }

  /**
   * @description Reset the password for a user using a token received in email.
   * @param {string} token - The token retrieved from the reset password URL.
   * @param {string} newPassword - A new password for the user.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async resetPassword(
    token: string,
    newPassword: PasswordType
  ): Promise<void> {
    const user = await this.db.findUserByResetPasswordToken(token);
    if (!user) {
      throw new Error('Reset password link expired');
    }

    // TODO move this getter into a password service module
    const resetTokens = get(user, ['services', 'password', 'reset']);
    const resetTokenRecord = find(resetTokens, t => t.token === token);

    if (this.server.isTokenExpired(token, resetTokenRecord)) {
      throw new Error('Reset password link expired');
    }

    const emails = user.emails || [];
    if (
      !includes(
        emails.map((email: EmailRecord) => email.address),
        resetTokenRecord.address
      )
    ) {
      throw new Error('Token has invalid email address');
    }

    const password = await this.hashAndBcryptPassword(newPassword);
    // Change the user password and remove the old token
    await this.db.setResetPassword(
      user.id,
      resetTokenRecord.address,
      password,
      token
    );
    // Changing the password should invalidate existing sessions
    this.db.invalidateAllSessions(user.id);
  }

  /**
   * @description Change the password for a user.
   * @param {string} userId - User id.
   * @param {string} newPassword - A new password for the user.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async setPassword(userId: string, newPassword: string): Promise<void> {
    const password = await bcryptPassword(newPassword);
    return this.db.setPassword(userId, password);
  }

  /**
   * @description Send an email with a link the user can use verify their email address.
   * @param {string} [address] - Which address of the user's to send the email to.
   * This address must be in the user's emails list.
   * Defaults to the first unverified email in the list.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async sendVerificationEmail(address: string): Promise<void> {
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
    const token = generateRandomToken();
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
  }

  /**
   * @description Send an email with a link the user can use to reset their password.
   * @param {string} [address] - Which address of the user's to send the email to.
   * This address must be in the user's emails list.
   * Defaults to the first email in the list.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async sendResetPasswordEmail(address: string): Promise<void> {
    if (!address) {
      throw new Error('Invalid email');
    }
    const user = await this.db.findUserByEmail(address);
    if (!user) {
      throw new Error('User not found');
    }
    address = getFirstUserEmail(user, address);
    const token = generateRandomToken();
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
  }

  /**
   * @description Send an email with a link the user can use to set their initial password.
   * @param {string} [address] - Which address of the user's to send the email to.
   * This address must be in the user's emails list.
   * Defaults to the first email in the list.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async sendEnrollmentEmail(address: string): Promise<void> {
    const user = await this.db.findUserByEmail(address);
    if (!user) {
      throw new Error('User not found');
    }
    address = getFirstUserEmail(user, address);
    const token = generateRandomToken();
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
  }

  /**
   * @description Create a new user.
   * @param user - The user object.
   * @returns Return the id of user created.
   */
  public async createUser(user: PasswordCreateUserType): Promise<string> {
    if (
      !this.options.validateUsername(user.username) &&
      !this.options.validateEmail(user.email)
    ) {
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
    if (
      isFunction(validateNewUser) &&
      !await validateNewUser(proposedUserObject)
    ) {
      throw new Error('User invalid');
    }

    return this.db.createUser(proposedUserObject);
  }

  private async passwordAuthenticator(
    user: string | LoginUserIdentityType,
    password: PasswordType
  ): Promise<UserObjectType> {
    const { username, email, id } = isString(user)
      ? this.toUsernameAndEmail({ user })
      : this.toUsernameAndEmail({ ...user });

    let foundUser: UserObjectType;

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
    const pass: any = hashAlgorithm
      ? hashPassword(password, hashAlgorithm)
      : password;
    const isPasswordValid = await verifyPassword(pass, hash);

    if (!isPasswordValid) {
      throw new Error('Incorrect password');
    }

    return foundUser;
  }

  private async hashAndBcryptPassword(password: PasswordType): Promise<string> {
    const hashAlgorithm = this.options.passwordHashAlgorithm;
    const hashedPassword: any = hashAlgorithm
      ? hashPassword(password, hashAlgorithm)
      : password;
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
