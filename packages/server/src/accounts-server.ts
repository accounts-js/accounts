import { pick, omit, isString } from 'lodash';
import * as jwt from 'jsonwebtoken';
import * as Emittery from 'emittery';
import { AccountsError } from '@accounts/common';
import {
  User,
  LoginResult,
  Tokens,
  Session,
  ImpersonationResult,
  HookListener,
  DatabaseInterface,
  AuthenticationService,
  ConnectionInformations,
  TokenRecord,
} from '@accounts/types';

import { generateAccessToken, generateRefreshToken, generateRandomToken } from './utils/tokens';

import { emailTemplates, sendMail } from './utils/email';
import { ServerHooks } from './utils/server-hooks';

import { AccountsServerOptions } from './types/accounts-server-options';
import { JwtData } from './types/jwt-data';
import { EmailTemplateType } from './types/email-template-type';

const defaultOptions = {
  tokenSecret: 'secret',
  tokenConfigs: {
    accessToken: {
      expiresIn: '90m',
    },
    refreshToken: {
      expiresIn: '7d',
    },
  },
  emailTemplates,
  userObjectSanitizer: (user: User) => user,
  sendMail,
  siteUrl: 'http://localhost:3000',
};

export class AccountsServer {
  public options: AccountsServerOptions;
  private services: { [key: string]: AuthenticationService };
  private db: DatabaseInterface;
  private hooks: Emittery;

  constructor(options: AccountsServerOptions, services: any) {
    this.options = { ...defaultOptions, ...options };
    if (!this.options.db) {
      throw new AccountsError('A database driver is required');
    }
    // TODO if this.options.tokenSecret === 'secret' warm user to change it

    this.services = services;
    this.db = this.options.db;

    // Set the db to all services
    // tslint:disable-next-line
    for (const service in this.services) {
      this.services[service].setStore(this.db);
      this.services[service].server = this;
    }

    // Initialize hooks
    this.hooks = new Emittery();
  }

  public getServices(): { [key: string]: AuthenticationService } {
    return this.services;
  }

  public getOptions(): AccountsServerOptions {
    return this.options;
  }

  public getHooks(): Emittery {
    return this.hooks;
  }

  public on(eventName: string, callback: HookListener): () => void {
    this.hooks.on(eventName, callback);

    return () => this.hooks.off(eventName, callback);
  }

  public async loginWithService(
    serviceName: string,
    params,
    infos: ConnectionInformations
  ): Promise<LoginResult> {
    const hooksInfo: any = {
      // The service name, such as “password” or “twitter”.
      service: serviceName,
      // The connection informations <ConnectionInformations>
      connection: infos,
      // Params received
      params,
    };
    try {
      if (!this.services[serviceName]) {
        throw new Error(`No service with the name ${serviceName} was registered.`);
      }

      const user: User = await this.services[serviceName].authenticate(params);
      if (!user) {
        throw new Error(`Service ${serviceName} was not able to authenticate user`);
      }
      hooksInfo.user = user;

      // Let the user validate the login attempt
      await this.hooks.emitSerial(ServerHooks.ValidateLogin, hooksInfo);
      const loginResult = await this.loginWithUser(user, infos);
      this.hooks.emit(ServerHooks.LoginSuccess, hooksInfo);
      return loginResult;
    } catch (err) {
      this.hooks.emit(ServerHooks.LoginError, { ...hooksInfo, error: err });
      throw err;
    }
  }

  /**
   * @description Server use only.
   * This method creates a session without authenticating any user identity.
   * Any authentication should happen before calling this function.
   * @param {User} userId - The user object.
   * @param {string} ip - User's ip.
   * @param {string} userAgent - User's client agent.
   * @returns {Promise<LoginResult>} - Session tokens and user object.
   */
  public async loginWithUser(user: User, infos: ConnectionInformations): Promise<LoginResult> {
    const { ip, userAgent } = infos;
    const token = generateRandomToken();
    const sessionId = await this.db.createSession(user.id, token, {
      ip,
      userAgent,
    });
    const { accessToken, refreshToken } = this.createTokens(token);

    return {
      sessionId,
      tokens: {
        refreshToken,
        accessToken,
      },
    };
  }

  /**
   * @description Impersonate to another user.
   * @param {string} accessToken - User access token.
   * @param {object} impersonated - impersonated user.
   * @param {string} ip - The user ip.
   * @param {string} userAgent - User user agent.
   * @returns {Promise<Object>} - ImpersonationResult
   */
  public async impersonate(
    accessToken: string,
    impersonated: {
      userId?: string;
      username?: string;
      email?: string;
    },
    ip: string,
    userAgent: string
  ): Promise<ImpersonationResult> {
    try {
      if (!isString(accessToken)) {
        throw new AccountsError('An access token is required');
      }

      try {
        jwt.verify(accessToken, this.options.tokenSecret);
      } catch (err) {
        throw new AccountsError('Access token is not valid');
      }

      const session = await this.findSessionByAccessToken(accessToken);

      if (!session.valid) {
        throw new AccountsError('Session is not valid for user');
      }

      const user = await this.db.findUserById(session.userId);

      if (!user) {
        throw new AccountsError('User not found');
      }

      let impersonatedUser;
      if (impersonated.userId) {
        impersonatedUser = await this.db.findUserById(impersonated.userId);
      } else if (impersonated.username) {
        impersonatedUser = await this.db.findUserByUsername(impersonated.username);
      } else if (impersonated.email) {
        impersonatedUser = await this.db.findUserByEmail(impersonated.email);
      }

      if (!impersonatedUser) {
        throw new AccountsError(`Impersonated user not found`);
      }

      if (!this.options.impersonationAuthorize) {
        return { authorized: false };
      }

      const isAuthorized = await this.options.impersonationAuthorize(user, impersonatedUser);

      if (!isAuthorized) {
        return { authorized: false };
      }

      const token = generateRandomToken();
      const newSessionId = await this.db.createSession(
        impersonatedUser.id,
        token,
        {
          ip,
          userAgent,
        },
        { impersonatorUserId: user.id }
      );
      const impersonationTokens = this.createTokens(newSessionId, true);
      const impersonationResult = {
        authorized: true,
        tokens: impersonationTokens,
        user: this.sanitizeUser(impersonatedUser),
      };

      this.hooks.emit(ServerHooks.ImpersonationSuccess, {
        user,
        impersonationResult,
      });

      return impersonationResult;
    } catch (e) {
      this.hooks.emit(ServerHooks.ImpersonationError, e);

      throw e;
    }
  }

  /**
   * @description Refresh a user token.
   * @param {string} accessToken - User access token.
   * @param {string} refreshToken - User refresh token.
   * @param {string} ip - User ip.
   * @param {string} userAgent - User user agent.
   * @returns {Promise<Object>} - LoginResult.
   */
  public async refreshTokens(
    accessToken: string,
    refreshToken: string,
    ip: string,
    userAgent: string
  ): Promise<LoginResult> {
    try {
      if (!isString(accessToken) || !isString(refreshToken)) {
        throw new AccountsError('An accessToken and refreshToken are required');
      }

      let sessionToken: string;
      try {
        jwt.verify(refreshToken, this.options.tokenSecret);
        const decodedAccessToken = jwt.verify(accessToken, this.options.tokenSecret, {
          ignoreExpiration: true,
        }) as { data: JwtData };
        sessionToken = decodedAccessToken.data.token;
      } catch (err) {
        throw new AccountsError('Tokens are not valid');
      }

      const session: Session = await this.db.findSessionByToken(sessionToken);
      if (!session) {
        throw new AccountsError('Session not found');
      }

      if (session.valid) {
        const user = await this.db.findUserById(session.userId);
        if (!user) {
          throw new AccountsError('User not found', { id: session.userId });
        }
        const tokens = this.createTokens(sessionToken);
        await this.db.updateSession(session.id, { ip, userAgent });

        const result = {
          sessionId: session.id,
          user: this.sanitizeUser(user),
          tokens,
        };

        this.hooks.emit(ServerHooks.RefreshTokensSuccess, result);

        return result;
      } else {
        throw new AccountsError('Session is no longer valid', {
          id: session.userId,
        });
      }
    } catch (err) {
      this.hooks.emit(ServerHooks.RefreshTokensError, err);

      throw err;
    }
  }

  /**
   * @description Refresh a user token.
   * @param {string} token - User session token.
   * @param {boolean} isImpersonated - Should be true if impersonating another user.
   * @returns {Promise<Object>} - Return a new accessToken and refreshToken.
   */
  public createTokens(token: string, isImpersonated: boolean = false): Tokens {
    const { tokenSecret, tokenConfigs } = this.options;
    const jwtData: JwtData = {
      token,
      isImpersonated,
    };
    const accessToken = generateAccessToken({
      data: jwtData,
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
  public async logout(accessToken: string): Promise<void> {
    try {
      const session: Session = await this.findSessionByAccessToken(accessToken);

      if (session.valid) {
        const user = await this.db.findUserById(session.userId);

        if (!user) {
          throw new AccountsError('User not found', { id: session.userId });
        }

        await this.db.invalidateSession(session.id);
        this.hooks.emit(ServerHooks.LogoutSuccess, {
          user: this.sanitizeUser(user),
          session,
          accessToken,
        });
      } else {
        throw new AccountsError('Session is no longer valid', {
          id: session.userId,
        });
      }
    } catch (error) {
      this.hooks.emit(ServerHooks.LogoutError, error);

      throw error;
    }
  }

  public async resumeSession(accessToken: string): Promise<User> {
    try {
      const session: Session = await this.findSessionByAccessToken(accessToken);

      if (session.valid) {
        const user = await this.db.findUserById(session.userId);

        if (!user) {
          throw new AccountsError('User not found', { id: session.userId });
        }

        if (this.options.resumeSessionValidator) {
          try {
            await this.options.resumeSessionValidator(user, session);
          } catch (e) {
            throw new AccountsError(e, { id: session.userId }, 403);
          }
        }

        this.hooks.emit(ServerHooks.ResumeSessionSuccess, { user, accessToken });

        return this.sanitizeUser(user);
      }

      this.hooks.emit(
        ServerHooks.ResumeSessionError,
        new AccountsError('Invalid Session', { id: session.userId })
      );

      return null;
    } catch (e) {
      this.hooks.emit(ServerHooks.ResumeSessionError, e);

      throw e;
    }
  }

  /**
   * @description Find a session by his token.
   * @param {string} accessToken
   * @returns {Promise<Session>} - Return a session.
   */
  public async findSessionByAccessToken(accessToken: string): Promise<Session> {
    if (!isString(accessToken)) {
      throw new AccountsError('An accessToken is required');
    }

    let sessionToken: string;
    try {
      const decodedAccessToken = jwt.verify(accessToken, this.options.tokenSecret) as {
        data: JwtData;
      };
      sessionToken = decodedAccessToken.data.token;
    } catch (err) {
      throw new AccountsError('Tokens are not valid');
    }

    const session: Session = await this.db.findSessionByToken(sessionToken);
    if (!session) {
      throw new AccountsError('Session not found');
    }

    return session;
  }

  /**
   * @description Find a user by his id.
   * @param {string} userId - User id.
   * @returns {Promise<Object>} - Return a user or null if not found.
   */
  public findUserById(userId: string): Promise<User> {
    return this.db.findUserById(userId);
  }

  /**
   * @description Change the profile for a user.
   * @param {string} userId - User id.
   * @param {Object} profile - The new user profile.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async setProfile(userId: string, profile: object): Promise<void> {
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
  public async updateProfile(userId: string, profile: object): Promise<object> {
    const user = await this.db.findUserById(userId);
    if (!user) {
      throw new AccountsError('User not found', { id: userId });
    }
    return this.db.setProfile(userId, { ...user.profile, ...profile });
  }

  public isTokenExpired(token: string, tokenRecord?: TokenRecord): boolean {
    return !tokenRecord || Number(tokenRecord.when) + this.options.emailTokensExpiry < Date.now();
  }

  public prepareMail(
    to: string,
    token: string,
    user: User,
    pathFragment: string,
    emailTemplate: EmailTemplateType,
    from: string
  ): any {
    if (this.options.prepareMail) {
      return this.options.prepareMail(to, token, user, pathFragment, emailTemplate, from);
    }
    return this.defaultPrepareEmail(to, token, user, pathFragment, emailTemplate, from);
  }

  public sanitizeUser(user: User): User {
    const { userObjectSanitizer } = this.options;

    return userObjectSanitizer(this.internalUserSanitizer(user), omit, pick as any);
  }

  private internalUserSanitizer(user: User): User {
    return omit(user, ['services']) as any;
  }

  private defaultPrepareEmail(
    to: string,
    token: string,
    user: User,
    pathFragment: string,
    emailTemplate: EmailTemplateType,
    from: string
  ): object {
    const tokenizedUrl = this.defaultCreateTokenizedUrl(pathFragment, token);
    return {
      from: emailTemplate.from || from,
      to,
      subject: emailTemplate.subject(user),
      text: emailTemplate.text(user, tokenizedUrl),
    };
  }

  private defaultCreateTokenizedUrl(pathFragment: string, token: string): string {
    const siteUrl = this.options.siteUrl;
    return `${siteUrl}/${pathFragment}/${token}`;
  }
}

export default AccountsServer;
