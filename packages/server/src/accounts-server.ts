import * as pick from 'lodash/pick';
import * as omit from 'lodash/omit';
import * as isString from 'lodash/isString';
import { EventEmitter } from 'events';
import * as jwt from 'jsonwebtoken';
import {
  AccountsError,
  UserObjectType,
  LoginReturnType,
  TokensType,
  SessionType,
  ImpersonateReturnType,
  HookListener,
} from '@accounts/common';
import { generateAccessToken, generateRefreshToken, generateRandomToken } from './tokens';
import { emailTemplates, EmailTemplateType, sendMail } from './email';
import {
  AccountsServerOptions,
  ConnectionInformationsType,
  AuthService,
  DBInterface,
} from './types';

export interface TokenRecord {
  token: string;
  address: string;
  when: number;
  reason: string;
}

export interface JwtData {
  token: string;
  isImpersonated: boolean;
}

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
  userObjectSanitizer: (user: UserObjectType) => user,
  sendMail,
  siteUrl: 'http://localhost:3000',
};

export type RemoveListnerHandle = () => EventEmitter;

export const ServerHooks = {
  LoginSuccess: 'LoginSuccess',
  LoginError: 'LoginError',
  LogoutSuccess: 'LogoutSuccess',
  LogoutError: 'LogoutError',
  CreateUserSuccess: 'CreateUserSuccess',
  CreateUserError: 'CreateUserError',
  ResumeSessionSuccess: 'ResumeSessionSuccess',
  ResumeSessionError: 'ResumeSessionError',
  RefreshTokensSuccess: 'RefreshTokensSuccess',
  RefreshTokensError: 'RefreshTokensError',
  ImpersonationSuccess: 'ImpersonationSuccess',
  ImpersonationError: 'ImpersonationError',
};

export class AccountsServer {
  public options: AccountsServerOptions;
  private services: { [key: string]: AuthService };
  private db: DBInterface;
  private hooks: EventEmitter;

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
    this.hooks = new EventEmitter();
  }

  public getServices(): { [key: string]: AuthService } {
    return this.services;
  }

  public getOptions(): AccountsServerOptions {
    return this.options;
  }

  public onLoginSuccess(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.LoginSuccess, callback);
  }

  public onLoginError(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.LoginError, callback);
  }

  public onLogoutSuccess(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.LogoutSuccess, callback);
  }

  public onLogoutError(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.LogoutError, callback);
  }

  public onCreateUserSuccess(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.CreateUserSuccess, callback);
  }

  public onCreateUserError(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.CreateUserError, callback);
  }

  public onResumeSessionSuccess(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.ResumeSessionSuccess, callback);
  }

  public onResumeSessionError(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.ResumeSessionError, callback);
  }

  public onRefreshTokensSuccess(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.RefreshTokensSuccess, callback);
  }

  public onRefreshTokensError(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.RefreshTokensError, callback);
  }

  public onImpersonationSuccess(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.ImpersonationSuccess, callback);
  }

  public onImpersonationError(callback: HookListener): RemoveListnerHandle {
    return this.on(ServerHooks.ImpersonationError, callback);
  }

  public async loginWithService(
    serviceName: string,
    params,
    infos: ConnectionInformationsType
  ): Promise<LoginReturnType> {
    if (!this.services[serviceName]) {
      throw new Error(`No service with the name ${serviceName} was registered.`);
    }
    const user: UserObjectType = await this.services[serviceName].authenticate(params);
    if (!user) {
      throw new Error(`Service ${serviceName} was not able to authenticate user`);
    }
    return this.loginWithUser(user, infos);
  }

  /**
   * @description Server use only. This method creates a session
   *              without authenticating any user identity.
   *              Any authentication should happen before calling this function.
   * @param {UserObjectType} userId - The user object.
   * @param {string} ip - User's ip.
   * @param {string} userAgent - User's client agent.
   * @returns {Promise<LoginReturnType>} - Session tokens and user object.
   */
  public async loginWithUser(
    user: UserObjectType,
    infos: ConnectionInformationsType
  ): Promise<LoginReturnType> {
    const { ip, userAgent } = infos;

    try {
      const token = generateRandomToken();
      const sessionId = await this.db.createSession(user.id, token, {
        ip,
        userAgent,
      });
      const { accessToken, refreshToken } = this.createTokens(token);

      const loginResult = {
        sessionId,
        user: this.sanitizeUser(user),
        tokens: {
          refreshToken,
          accessToken,
        },
      };

      this.hooks.emit(ServerHooks.LoginSuccess, user);
      return loginResult;
    } catch (e) {
      this.hooks.emit(ServerHooks.LoginError, e);
      throw e;
    }
  }

  /**
   * @description Impersonate to another user.
   * @param {string} accessToken - User access token.
   * @param {string} username - impersonated user username.
   * @param {string} ip - The user ip.
   * @param {string} userAgent - User user agent.
   * @returns {Promise<Object>} - ImpersonateReturnType
   */
  public async impersonate(
    accessToken: string,
    username: string,
    ip: string,
    userAgent: string
  ): Promise<ImpersonateReturnType> {
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

      const impersonatedUser = await this.db.findUserByUsername(username);
      if (!impersonatedUser) {
        throw new AccountsError(`User ${username} not found`);
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

      this.hooks.emit(ServerHooks.ImpersonationSuccess, user, impersonationResult);

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
   * @returns {Promise<Object>} - LoginReturnType.
   */
  public async refreshTokens(
    accessToken: string,
    refreshToken: string,
    ip: string,
    userAgent: string
  ): Promise<LoginReturnType> {
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

      const session: SessionType = await this.db.findSessionByToken(sessionToken);
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
  public createTokens(token: string, isImpersonated: boolean = false): TokensType {
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
      const session: SessionType = await this.findSessionByAccessToken(accessToken);

      if (session.valid) {
        const user = await this.db.findUserById(session.userId);

        if (!user) {
          throw new AccountsError('User not found', { id: session.userId });
        }

        await this.db.invalidateSession(session.id);
        this.hooks.emit(ServerHooks.LogoutSuccess, this.sanitizeUser(user), session, accessToken);
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

  public async resumeSession(accessToken: string): Promise<UserObjectType> {
    try {
      const session: SessionType = await this.findSessionByAccessToken(accessToken);

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

        this.hooks.emit(ServerHooks.ResumeSessionSuccess, user, accessToken);

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
   * @returns {Promise<SessionType>} - Return a session.
   */
  public async findSessionByAccessToken(accessToken: string): Promise<SessionType> {
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

    const session: SessionType = await this.db.findSessionByToken(sessionToken);
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
  public findUserById(userId: string): Promise<UserObjectType> {
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

  public on(eventName: string, callback: HookListener): RemoveListnerHandle {
    this.hooks.on(eventName, callback);

    return () => this.hooks.removeListener(eventName, callback);
  }

  public isTokenExpired(token: string, tokenRecord?: TokenRecord): boolean {
    return !tokenRecord || Number(tokenRecord.when) + this.options.emailTokensExpiry < Date.now();
  }

  public prepareMail(
    to: string,
    token: string,
    user: UserObjectType,
    pathFragment: string,
    emailTemplate: EmailTemplateType,
    from: string
  ): any {
    if (this.options.prepareMail) {
      return this.options.prepareMail(to, token, user, pathFragment, emailTemplate, from);
    }
    return this.defaultPrepareEmail(to, token, user, pathFragment, emailTemplate, from);
  }

  public sanitizeUser(user: UserObjectType): UserObjectType {
    const { userObjectSanitizer } = this.options;

    return userObjectSanitizer(this.internalUserSanitizer(user), omit, pick);
  }

  private internalUserSanitizer(user: UserObjectType): UserObjectType {
    return omit(user, ['services']);
  }

  private defaultPrepareEmail(
    to: string,
    token: string,
    user: UserObjectType,
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
