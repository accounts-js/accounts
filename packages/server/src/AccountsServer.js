// @flow

import { isString, isPlainObject, find, includes, get } from 'lodash';
import jwt from 'jsonwebtoken';
import {
  AccountsError,
  toUsernameAndEmail,
  validators,
} from '@accounts/common';
import type {
  UserObjectType,
    CreateUserType,
    PasswordLoginUserType,
    LoginReturnType,
    TokensType,
    SessionType,
} from '@accounts/common';
import config from './config';
import type { DBInterface } from './DBInterface';
import { verifyPassword, hashPassword } from './encryption';
import {
  generateAccessToken,
  generateRefreshToken,
  generateRandomToken,
} from './tokens';
import Email from './email';
import emailTemplates from './emailTemplates';
import type { EmailConnector } from './email';
import type { EmailTemplatesType, EmailTemplateType } from './emailTemplates';
import type { AccountsServerConfiguration, PasswordAuthenticator } from './config';

export class AccountsServer {
  _options: AccountsServerConfiguration
  db: DBInterface
  email: EmailConnector
  emailTemplates: EmailTemplatesType

  /**
   * @description Configure AccountsServer.
   * @param {Object} options - Options for AccountsServer.
   * @param {Object} db - DBInterface for AccountsServer.
   * @returns {Object} - Return the options.
   */
  config(options: AccountsServerConfiguration, db: DBInterface) {
    this._options = ({
      ...config,
      ...options,
    }: AccountsServerConfiguration);
    if (!db) {
      throw new AccountsError('A database driver is required');
    }
    this.db = db;
    if (this._options.sendMail) {
      this.email = { sendMail: this._options.sendMail };
    } else {
      this.email = new Email(this._options.email);
    }
    this.emailTemplates = emailTemplates;
  }

  /**
   * @description Return the AccountsServer options.
   * @returns {Object} - Return the options.
   */
  options(): Object {
    return this._options;
  }

  /**
   * @description Login the user with his password.
   * @param {Object} user - User to login.
   * @param {string} password - Password of user to login.
   * @param {string} ip - User ip.
   * @param {string} userAgent - User user agent.
   * @returns {Promise<Object>} - LoginReturnType.
   */
  // eslint-disable-next-line max-len
  async loginWithPassword(user: PasswordLoginUserType, password: string, ip: ?string, userAgent: ?string): Promise<LoginReturnType> {
    if (!user || !password) {
      throw new AccountsError('Unrecognized options for login request', user, 400);
    }
    if ((!isString(user) && !isPlainObject(user)) || !isString(password)) {
      throw new AccountsError('Match failed', user, 400);
    }

    let foundUser;

    if (this._options.passwordAuthenticator) {
      try {
        foundUser = await this._externalPasswordAuthenticator(
          this._options.passwordAuthenticator,
          user,
          password);
      } catch (e) {
        throw new AccountsError(e, user, 403);
      }
    } else {
      foundUser = await this._defaultPasswordAuthenticator(user, password);
    }

    if (!foundUser) {
      throw new AccountsError('User not found', user, 403);
    }

    const sessionId = await this.db.createSession(foundUser.id, ip, userAgent);
    const { accessToken, refreshToken } = this.createTokens(sessionId);

    return {
      sessionId,
      user: foundUser,
      tokens: {
        refreshToken,
        accessToken,
      },
    };
  }

  // eslint-disable-next-line max-len
  async _externalPasswordAuthenticator(authFn: PasswordAuthenticator, user: PasswordLoginUserType, password: string): Promise<any> {
    return authFn(user, password);
  }

  async _defaultPasswordAuthenticator(user: PasswordLoginUserType, password: string): Promise<any> {
    const { username, email, id } = isString(user)
      ? toUsernameAndEmail({ user })
      : toUsernameAndEmail({ ...user });

    let foundUser;

    if (id) {
      foundUser = await this.db.findUserById(id);
    } else if (username) {
      foundUser = await this.db.findUserByUsername(username);
    } else if (email) {
      foundUser = await this.db.findUserByEmail(email);
    }

    if (!foundUser) {
      throw new AccountsError('User not found', user, 403);
    }
    const hash = await this.db.findPasswordHash(foundUser.id);
    if (!hash) {
      throw new AccountsError('User has no password set', user, 403);
    }

    const hashAlgorithm = this._options.passwordHashAlgorithm;
    const pass = hashAlgorithm ? hashPassword(password, hashAlgorithm) : password;
    const isPasswordValid = await verifyPassword(pass, hash);

    if (!isPasswordValid) {
      throw new AccountsError('Incorrect password', user, 403);
    }

    return foundUser;
  }

  /**
   * @description Create a new user.
   * @param {Object} user - The user object.
   * @returns {Promise<string>} - Return the id of user created.
   */
  async createUser(user: CreateUserType): Promise<string> {
    if (!validators.validateUsername(user.username) && !validators.validateEmail(user.email)) {
      throw new AccountsError(
        'Username or Email is required',
        {
          username: user && user.username,
          email: user && user.email,
        },
      );
    }
    if (user.username && await this.db.findUserByUsername(user.username)) {
      throw new AccountsError('Username already exists', { username: user.username });
    }
    if (user.email && await this.db.findUserByEmail(user.email)) {
      throw new AccountsError('Email already exists', { email: user.email });
    }

    // TODO Accounts.onCreateUser
    const userId: string = await this.db.createUser({
      username: user.username,
      email: user.email && user.email.toLowerCase(),
      password: user.password,
      profile: user.profile,
    });

    return userId;
  }

  /**
   * @description Refresh a user token.
   * @param {string} accessToken - User access token.
   * @param {string} refreshToken - User refresh token.
   * @param {string} ip - User ip.
   * @param {string} userAgent - User user agent.
   * @returns {Promise<Object>} - LoginReturnType.
   */
  // eslint-disable-next-line max-len
  async refreshTokens(accessToken: string, refreshToken: string, ip: string, userAgent: string): Promise<LoginReturnType> {
    if (!isString(accessToken) || !isString(refreshToken)) {
      throw new AccountsError('An accessToken and refreshToken are required');
    }

    let sessionId;
    try {
      jwt.verify(refreshToken, this._options.tokenSecret);
      const decodedAccessToken = jwt.verify(accessToken, this._options.tokenSecret, {
        ignoreExpiration: true,
      });
      sessionId = decodedAccessToken.data.sessionId;
    } catch (err) {
      throw new AccountsError('Tokens are not valid');
    }

    const session: ?SessionType = await this.db.findSessionById(sessionId);
    if (!session) {
      throw new AccountsError('Session not found');
    }

    if (session.valid) {
      const user = await this.db.findUserById(session.userId);
      if (!user) {
        throw new AccountsError('User not found', { id: session.userId });
      }
      const tokens = this.createTokens(sessionId);
      await this.db.updateSession(sessionId, ip, userAgent);
      return {
        sessionId,
        user,
        tokens,
      };
    } else { // eslint-disable-line no-else-return
      throw new AccountsError('Session is no longer valid', { id: session.userId });
    }
  }

  /**
   * @description Refresh a user token.
   * @param {string} sessionId - User session id.
   * @returns {Promise<Object>} - Return a new accessToken and refreshToken.
   */
  createTokens(sessionId: string): TokensType {
    const { tokenSecret = config.tokenSecret, tokenConfigs = config.tokenConfigs } = this._options;
    const accessToken = generateAccessToken({
      data: {
        sessionId,
      },
      secret: tokenSecret,
      config: tokenConfigs.accessToken || {},
    });
    const refreshToken = generateRefreshToken({
      secret: tokenSecret,
      config: tokenConfigs.refreshToken || {},
    });
    return { accessToken, refreshToken };
  }

  /**
   * @description Logout a user and invalidate his session.
   * @param {string} accessToken - User access token.
   * @returns {Promise<void>} - Return a promise.
   */
  async logout(accessToken: string): Promise<void> {
    const session: SessionType = await this.findSessionByAccessToken(accessToken);
    if (session.valid) {
      const user = await this.db.findUserById(session.userId);
      if (!user) {
        throw new AccountsError('User not found', { id: session.userId });
      }
      await this.db.invalidateSession(session.sessionId);
    } else { // eslint-disable-line no-else-return
      throw new AccountsError('Session is no longer valid', { id: session.userId });
    }
  }

  async resumeSession(accessToken: string): Promise<?UserObjectType> {
    const session: SessionType = await this.findSessionByAccessToken(accessToken);
    if (session.valid) {
      const user = await this.db.findUserById(session.userId);
      if (!user) {
        throw new AccountsError('User not found', { id: session.userId });
      }

      if (this._options.resumeSessionValidator) {
        try {
          await this._options.resumeSessionValidator(user, session);
        } catch (e) {
          throw new AccountsError(e, { id: session.userId }, 403);
        }
      }

      return user;
    }
    return null;
  }

  async findSessionByAccessToken(accessToken: string): Promise<SessionType> {
    if (!isString(accessToken)) {
      throw new AccountsError('An accessToken is required');
    }

    let sessionId;
    try {
      const decodedAccessToken = jwt.verify(accessToken, this._options.tokenSecret);
      sessionId = decodedAccessToken.data.sessionId;
    } catch (err) {
      throw new AccountsError('Tokens are not valid');
    }

    const session: ?SessionType = await this.db.findSessionById(sessionId);
    if (!session) {
      throw new AccountsError('Session not found');
    }

    return session;
  }

  /**
   * @description Find a user by one of his emails.
   * @param {string} email - User email.
   * @returns {Promise<Object>} - Return a user or null if not found.
   */
  findUserByEmail(email: string): Promise<?UserObjectType> {
    return this.db.findUserByEmail(email);
  }

  /**
   * @description Find a user by his username.
   * @param {string} username - User username.
   * @returns {Promise<Object>} - Return a user or null if not found.
   */
  findUserByUsername(username: string): Promise<?UserObjectType> {
    return this.db.findUserByUsername(username);
  }

  /**
   * @description Find a user by his id.
   * @param {string} userId - User id.
   * @returns {Promise<Object>} - Return a user or null if not found.
   */
  findUserById(userId: string): Promise<?UserObjectType> {
    return this.db.findUserById(userId);
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
  addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    return this.db.addEmail(userId, newEmail, verified);
  }

  /**
   * @description Remove an email address for a user.
   * Use this instead of directly updating the database.
   * @param {string} userId - User id.
   * @param {string} email - The email address to remove.
   * @returns {Promise<void>} - Return a Promise.
   */
  removeEmail(userId: string, email: string): Promise<void> {
    return this.db.removeEmail(userId, email);
  }

  /**
   * @description Marks the user's email address as verified.
   * @param {string} token - The token retrieved from the verification URL.
   * @returns {Promise<void>} - Return a Promise.
   */
  async verifyEmail(token: string): Promise<void> {
    const user = await this.db.findUserByEmailVerificationToken(token);
    if (!user) {
      throw new AccountsError('Verify email link expired');
    }

    const verificationTokens = get(user, ['services', 'email', 'verificationTokens'], []);
    const tokenRecord = find(verificationTokens,
                             (t: Object) => t.token === token);
    if (!tokenRecord) {
      throw new AccountsError('Verify email link expired');
    }
    // TODO check time for expiry date
    const emailRecord = find(user.emails, (e: Object) => e.address === tokenRecord.address);
    if (!emailRecord) {
      throw new AccountsError('Verify email link is for unknown address');
    }
    await this.db.verifyEmail(user.id, emailRecord.address);
  }

  /**
   * @description Reset the password for a user using a token received in email.
   * @param {string} token - The token retrieved from the reset password URL.
   * @param {string} newPassword - A new password for the user.
   * @returns {Promise<void>} - Return a Promise.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.db.findUserByResetPasswordToken(token);
    if (!user) {
      throw new AccountsError('Reset password link expired');
    }
    const resetTokens = get(user, ['services', 'password', 'resetTokens']);
    const resetTokenRecord = find(resetTokens,
                                  (t: Object) => t.token === token);
    if (!resetTokenRecord) {
      throw new AccountsError('Reset password link expired');
    }
    // TODO check time for expiry date
    const emails = user.emails || [];
    if (!includes(emails.map((email: Object) => email.address), resetTokenRecord.email)) {
      throw new AccountsError('Token has invalid email address');
    }
    // Change the user password and remove the old token
    await this.db.setResetPasssword(user.id, resetTokenRecord.email, newPassword, token);
    // Changing the password should invalidate existing sessions
    this.db.invalidateAllSessions(user.id);
  }

  /**
   * @description Change the password for a user.
   * @param {string} userId - User id.
   * @param {string} newPassword - A new password for the user.
   * @returns {Promise<void>} - Return a Promise.
   */
  setPassword(userId: string, newPassword: string): Promise<void> {
    return this.db.setPasssword(userId, newPassword);
  }

  /**
   * @description Change the profile for a user.
   * @param {string} userId - User id.
   * @param {Object} profile - The new user profile.
   * @returns {Promise<void>} - Return a Promise.
   */
  async setProfile(userId: string, profile: Object): Promise<void> {
    const user = await this.db.findUserById(userId);
    if (!user) {
      throw new AccountsError('User not found', { id: userId });
    }
    await this.db.setProfile(userId, profile);
  }

  /**
   * @description Update the profile for a user,
   * the new profile will be added to the existing one.
   * @param {string} userId - User id.
   * @param {Object} profile - User profile to add.
   * @returns {Promise<Object>} - Return a Promise.
   */
  async updateProfile(userId: string, profile: Object): Promise<Object> {
    const user = await this.db.findUserById(userId);
    if (!user) {
      throw new AccountsError('User not found', { id: userId });
    }
    const res = await this.db.setProfile(userId, { ...user.profile, ...profile });
    return res;
  }

  /**
   * @description Send an email with a link the user can use verify their email address.
   * @param {string} [address] - Which address of the user's to send the email to.
   * This address must be in the user's emails list.
   * Defaults to the first unverified email in the list.
   * @returns {Promise<void>} - Return a Promise.
   */
  async sendVerificationEmail(address: string): Promise<void> {
    const user = await this.db.findUserByEmail(address);
    if (!user) {
      throw new AccountsError('User not found', { email: address });
    }
    // If no address provided find the first unverified email
    if (!address) {
      const email = find(user.emails, (e: Object) => !e.verified);
      address = email && email.address; // eslint-disable-line no-param-reassign
    }
    // Make sure the address is valid
    const emails = user.emails || [];
    if (!address || !includes(emails.map((email: Object) => email.address), address)) {
      throw new AccountsError('No such email address for user');
    }
    const token = generateRandomToken();
    await this.db.addEmailVerificationToken(user.id, address, token);

    const resetPasswordMail = this._prepareMail(
      address,
      token,
      user,
      'verify-email',
      this.emailTemplates.verifyEmail,
      this.emailTemplates.from,
    );

    await this.email.sendMail(resetPasswordMail);
  }

  /**
   * @description Send an email with a link the user can use to reset their password.
   * @param {string} [address] - Which address of the user's to send the email to.
   * This address must be in the user's emails list.
   * Defaults to the first email in the list.
   * @returns {Promise<void>} - Return a Promise.
   */
  async sendResetPasswordEmail(address: string): Promise<void> {
    const user = await this.db.findUserByEmail(address);
    if (!user) {
      throw new AccountsError('User not found', { email: address });
    }
    address = this._getFirstUserEmail(user, address); // eslint-disable-line no-param-reassign
    const token = generateRandomToken();
    await this.db.addResetPasswordToken(user.id, address, token);

    const resetPasswordMail = this._prepareMail(
      address,
      token,
      user,
      'reset-password',
      this.emailTemplates.resetPassword,
      this.emailTemplates.from,
    );

    await this.email.sendMail(resetPasswordMail);
  }

  /**
   * @description Send an email with a link the user can use to set their initial password.
   * @param {string} [address] - Which address of the user's to send the email to.
   * This address must be in the user's emails list.
   * Defaults to the first email in the list.
   * @returns {Promise<void>} - Return a Promise.
   */
  async sendEnrollmentEmail(address: string): Promise<void> {
    const user = await this.db.findUserByEmail(address);
    if (!user) {
      throw new AccountsError('User not found', { email: address });
    }
    address = this._getFirstUserEmail(user, address); // eslint-disable-line no-param-reassign
    const token = generateRandomToken();
    await this.db.addResetPasswordToken(user.id, address, token, 'enroll');

    const enrollmentMail = this._prepareMail(
      address,
      token,
      user,
      'enroll-account',
      this.emailTemplates.enrollAccount,
      this.emailTemplates.from,
    );

    await this.email.sendMail(enrollmentMail);
  }

  _prepareMail(...args: Array<any>): any {
    if (this._options.prepareMail) {
      return this._options.prepareMail(...args);
    }
    return this._defaultPrepareEmail(...args);
  }

  // eslint-disable-next-line max-len
  _defaultPrepareEmail(to: string, token: string, user: UserObjectType, pathFragment: string, emailTemplate: EmailTemplateType, from: string): Object {
    const tokenizedUrl = this._defaultCreateTokenizedUrl(pathFragment, token);
    return {
      from: emailTemplate.from || from,
      to,
      subject: emailTemplate.subject(user),
      text: emailTemplate.text(user, tokenizedUrl),
    };
  }

  _defaultCreateTokenizedUrl(pathFragment: string, token: string): string {
    const siteUrl = this._options.siteUrl || config.siteUrl;
    return `${siteUrl}/${pathFragment}/${token}`;
  }

  _getFirstUserEmail(user: UserObjectType, address: string): string {
    // Pick the first email if we weren't passed an email
    if (!address && user.emails && user.emails[0]) {
      address = user.emails[0].address; // eslint-disable-line no-param-reassign
    }
    // Make sure the address is valid
    const emails = user.emails || [];
    if (!address || !includes(emails.map((email: Object) => email.address), address)) {
      throw new AccountsError('No such email address for user');
    }
    return address;
  }
}

export default new AccountsServer();
