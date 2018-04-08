import * as pick from 'lodash/pick';
import * as omit from 'lodash/omit';
import * as isString from 'lodash/isString';
import * as Emittery from 'emittery';
import { AccountsError } from '@accounts/common';
import TokenManager from '@accounts/token-manager';
import {
  User,
  LoginResult,
  Tokens,
  Session,
  ImpersonationResult,
  HookListener,
  DatabaseInterface,
  AuthenticationService,
  AuthenticationServices,
  ConnectionInformations,
  TokenRecord,
  NotificationService,
  NotificationServices,
  UserSafe,
} from '@accounts/types';

import { ServerHooks } from './utils/server-hooks';

import { Configuration } from './types/configuration';
import { JwtData } from './types/jwt-data';

const defaultConfig = {
  authenticationServices: [],
  notificationServices: []
};

export class AccountsServer {
  public config: Configuration;
  public tokenManager: TokenManager;
  public db: DatabaseInterface;
  public notificationServices: NotificationServices;
  private services: AuthenticationServices;
  private hooks: Emittery;

  constructor(config: Configuration) {
    this.config = { ...defaultConfig, ...config };
    if (!this.config.db) {
      throw new AccountsError('A database driver is required');
    }
    if (!this.config.tokenManager) {
      throw new AccountsError('A tokenManager is required');
    }

    this.db = this.config.db;
    this.tokenManager = this.config.tokenManager;

    this.services = this.config.authenticationServices.reduce(
      ( acc: AuthenticationServices, authenticationService: AuthenticationService ) =>
      ({ ...acc, [authenticationService.serviceName]: authenticationService.link(this) })
    ,{})

    this.notificationServices = this.config.notificationServices.reduce(
      ( acc: NotificationServices, notificationService: NotificationService ) =>
      ({ ...acc, [notificationService.name]: notificationService })
    ,{})

    // Initialize hooks
    this.hooks = new Emittery();
  }

  public on(eventName: string, callback: HookListener): () => void {
    this.hooks.on(eventName, callback);

    return () => this.hooks.off(eventName, callback);
  }

  public useService(target: any, params: any, connectionInfo: ConnectionInformations ): any {
		const { service, ...serviceParams } = target;
		const authenticationService: AuthenticationService = this.services[service];
		if(!authenticationService) {
			throw new AccountsError(`[ Accounts - Server ] useService : Service ${service} not found`);
    }
		return authenticationService.useService(serviceParams, params, connectionInfo);
  }
  
  public useNotificationService(notificationServiceName: string): NotificationService {
		const notificationService: NotificationService = this.notificationServices[notificationServiceName]
		if(!notificationService){
      throw new AccountsError(`[ Accounts - Server ] useNotificationService : notificationService ${notificationServiceName} not found`);
    }
		return notificationService
	}

  /**
   * @description Server use only. This method creates a session
   *              without authenticating any user identity.
   *              Any authentication should happen before calling this function.
   * @param {User} userId - The user object.
   * @param {ConnectionInformations} connectionInfo - The user connectionInformations.
   * @returns {Promise<LoginResult>} - Session tokens and user object.
   */
  public async loginWithUser(user: User, infos: ConnectionInformations): Promise<LoginResult> {
    const { ip, userAgent } = infos;

    try {
      const token = this.tokenManager.generateRandomToken();
      const sessionId = await this.db.createSession(user.id, token, {
        ip,
        userAgent,
      });
      const tokens = this.createTokens(token);

      const userSafe = this.sanitizeUser(user);
      const loginResult = { sessionId, user: userSafe, tokens };

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
   * @param {object} impersonated - impersonated user.
   * @param {ConnectionInformations} connectionInfo - The user connectionInformations.
   * @returns {Promise<Object>} - ImpersonationResult
   */
  public async impersonate(
    accessToken: string,
    impersonated: {
      userId?: string;
      username?: string;
      email?: string;
    },
    connectionInfo: ConnectionInformations
  ): Promise<ImpersonationResult> {
    try {
      if (!isString(accessToken)) {
        throw new AccountsError('An access token is required');
      }

      try {
        this.tokenManager.decodeToken(accessToken);
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

      if (!this.config.impersonationAuthorize) {
        return { authorized: false };
      }

      const isAuthorized = await this.config.impersonationAuthorize(user, impersonatedUser);

      if (!isAuthorized) {
        return { authorized: false };
      }

      const token = this.tokenManager.generateRandomToken();
      const newSessionId = await this.db.createSession(
        impersonatedUser.id,
        token,
        connectionInfo,
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
   * @param {ConnectionInformations} connectionInfo - The user connectionInformations.
   * @returns {Promise<Object>} - LoginResult.
   */
  public async refreshTokens(
    accessToken: string,
    refreshToken: string,
    connectionInfo: ConnectionInformations
  ): Promise<LoginResult> {
    try {
      if (!isString(accessToken) || !isString(refreshToken)) {
        throw new AccountsError('An accessToken and refreshToken are required');
      }

      let sessionToken: string;
      try {
        this.tokenManager.decodeToken(refreshToken);
        const decodedAccessToken: { data: JwtData } = this.tokenManager.decodeToken(
          accessToken,
          true
        );
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
        await this.db.updateSession(session.id, connectionInfo);

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
    const jwtData: JwtData = { token, isImpersonated };
    const accessToken = this.tokenManager.generateAccessToken(jwtData);
    const refreshToken = this.tokenManager.generateRefreshToken();
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

        if (this.config.resumeSessionValidator) {
          try {
            await this.config.resumeSessionValidator(user, session);
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
      const decodedAccessToken: { data: JwtData } = this.tokenManager.decodeToken(accessToken);
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

  public sanitizeUser(user: User): UserSafe {
    const { services, ...userSafe } = user;
    return this.config.sanitizeUser ? this.config.sanitizeUser(userSafe) : userSafe
  }

}

export default AccountsServer;
