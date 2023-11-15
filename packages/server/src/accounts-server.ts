import merge from 'lodash.merge';
import * as jwt from 'jsonwebtoken';
import Emittery from 'emittery';
import {
  User,
  LoginResult,
  Tokens,
  Session,
  ImpersonationUserIdentity,
  ImpersonationResult,
  HookListener,
  DatabaseInterface,
  ConnectionInformations,
  DatabaseInterfaceUser,
  DatabaseInterfaceSessions,
} from '@accounts/types';

import { generateAccessToken, generateRefreshToken, generateRandomToken } from './utils/tokens';

import { emailTemplates, sendMail } from './utils/email';
import { ServerHooks } from './utils/server-hooks';

import { AccountsServerOptions } from './types/accounts-server-options';
import { JwtData } from './types/jwt-data';
import { EmailTemplateType } from './types/email-template-type';
import { JwtPayload } from './types/jwt-payload';
import { AccountsJsError } from './utils/accounts-error';
import {
  AuthenticateWithServiceErrors,
  LoginWithServiceErrors,
  ImpersonateErrors,
  FindSessionByAccessTokenErrors,
  RefreshTokensErrors,
  LogoutErrors,
  ResumeSessionErrors,
} from './errors';
import { isString } from './utils/validation';
import { ExecutionContext, Inject, Injectable } from 'graphql-modules';
import { AccountsCoreConfigToken } from './types/AccountsCoreConfig.symbol';
import { AuthenticationServicesToken } from './types/AuthenticationServices.symbol';
import { AuthenticationServices } from './types/authentication-services';
import { DatabaseInterfaceUserToken } from './types/DatabaseInterfaceUser.symbol';
import { DatabaseInterfaceSessionsToken } from './types/DatabaseInterfaceSessions.symbol';

const defaultOptions = {
  enableAutologin: false,
  micro: false,
  ambiguousErrorMessages: true,
  tokenSecret: 'secret' as
    | string
    | {
        publicKey: jwt.Secret;
        privateKey: jwt.Secret;
      },
  tokenConfigs: {
    accessToken: {
      expiresIn: '90m',
    },
    refreshToken: {
      expiresIn: '7d',
    },
  },
  emailTemplates,
  sendMail,
  siteUrl: 'http://localhost:3000',
  userObjectSanitizer: <CustomUser extends User = User>(user: CustomUser) => user,
  createNewSessionTokenOnRefresh: false,
  useInternalUserObjectSanitizer: true,
  useStatelessSession: false,
};

@Injectable({
  global: true,
})
export class AccountsServer<CustomUser extends User = User> {
  @ExecutionContext() public context!: ExecutionContext;
  public options: AccountsServerOptions<CustomUser> & typeof defaultOptions;
  private hooks: Emittery;
  private micro: boolean;
  private dbSessions: DatabaseInterfaceSessions;

  constructor(
    @Inject(AccountsCoreConfigToken) options: AccountsServerOptions<CustomUser>,
    @Inject(AuthenticationServicesToken) public services: AuthenticationServices<CustomUser>,
    @Inject(DatabaseInterfaceUserToken)
    private db: DatabaseInterface<CustomUser> | DatabaseInterfaceUser<CustomUser>,
    @Inject(DatabaseInterfaceSessionsToken) dbSessions?: DatabaseInterfaceSessions
  ) {
    this.options = merge({ ...defaultOptions }, options);
    this.micro = this.options.micro;
    this.dbSessions = dbSessions ?? (db as DatabaseInterfaceSessions);
    if (this.options.tokenSecret === defaultOptions.tokenSecret) {
      console.log(`
You are using the default secret "${this.options.tokenSecret}" which is not secure.
Please change it with a strong random token.`);
    }

    this.services = services || {};

    for (const serviceName in this.services) {
      const service = this.services[serviceName];
      // We have an instance, thus no Dependency Injection is being used (REST)
      // and we must manually set the db and server in all services
      if (typeof service === 'object') {
        service.setUserStore(this.db);
        service.setSessionsStore(this.dbSessions);
        service.server = this;
      }
    }

    // Initialize hooks
    this.hooks = new Emittery();
  }

  private getService(serviceName: string) {
    const instanceOrCtor = this.services[serviceName];
    // If it's a constructor we use dependency injection (GraphQL), otherwise we already have an instance (REST)
    const service =
      typeof instanceOrCtor === 'function'
        ? this.context.injector.get(instanceOrCtor)
        : instanceOrCtor;
    if (!service) {
      throw new AccountsJsError(
        `No service with the name ${serviceName} was registered.`,
        AuthenticateWithServiceErrors.ServiceNotFound
      );
    }
    return service;
  }

  public getServices(): AuthenticationServices<CustomUser> {
    return this.services;
  }

  public getOptions(): AccountsServerOptions<CustomUser> {
    return this.options;
  }

  public getHooks(): Emittery {
    return this.hooks;
  }

  /**
   * Subscribe to an accounts-js event.
   * ```javascript
   * accountsServer.on(ServerHooks.ValidateLogin, ({ user }) => {
   *   // This hook is called every time a user try to login
   *   // You can use it to only allow users with verified email to login
   * });
   * ```
   */
  public on(eventName: string, callback: HookListener): () => void {
    this.hooks.on(eventName, callback);

    return () => this.hooks.off(eventName, callback);
  }

  /**
   * @description Try to authenticate the user for a given service
   * @throws {@link AuthenticateWithServiceErrors}
   */
  public async authenticateWithService(
    serviceName: string,
    params: any,
    infos: ConnectionInformations
  ): Promise<boolean> {
    const hooksInfo: any = {
      // The service name, such as “password” or “twitter”.
      service: serviceName,
      // The connection informations <ConnectionInformations>
      connection: infos,
      // Params received
      params,
    };
    try {
      const user: CustomUser | null = await this.getService(serviceName).authenticate(params);
      hooksInfo.user = user;
      if (!user) {
        throw new AccountsJsError(
          `Service ${serviceName} was not able to authenticate user`,
          AuthenticateWithServiceErrors.AuthenticationFailed
        );
      }
      if (user.deactivated) {
        throw new AccountsJsError(
          'Your account has been deactivated',
          AuthenticateWithServiceErrors.UserDeactivated
        );
      }

      await this.hooks.emit(ServerHooks.AuthenticateSuccess, hooksInfo);
      return true;
    } catch (err) {
      await this.hooks.emit(ServerHooks.AuthenticateError, { ...hooksInfo, error: err });
      throw err;
    }
  }

  /**
   * @throws {@link LoginWithServiceErrors}
   */
  public async loginWithService(
    serviceName: string,
    params: any,
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
      const user: CustomUser | null = await this.getService(serviceName).authenticate(params);
      hooksInfo.user = user;
      if (!user) {
        throw new AccountsJsError(
          `Service ${serviceName} was not able to authenticate user`,
          LoginWithServiceErrors.AuthenticationFailed
        );
      }
      if (user.deactivated) {
        throw new AccountsJsError(
          'Your account has been deactivated',
          LoginWithServiceErrors.UserDeactivated
        );
      }

      // Let the user validate the login attempt
      await this.hooks.emitSerial(ServerHooks.ValidateLogin, hooksInfo);
      const loginResult = await this.loginWithUser(user, infos);
      await this.hooks.emit(ServerHooks.LoginSuccess, hooksInfo);
      return loginResult;
    } catch (err) {
      await this.hooks.emit(ServerHooks.LoginError, { ...hooksInfo, error: err });
      throw err;
    }
  }

  /**
   * @description Server use only.
   * This method creates a session without authenticating any user identity.
   * Any authentication should happen before calling this function.
   * @param {User} user - The user object.
   * @param {ConnectionInformations} infos - User's connection informations.
   * @returns {Promise<LoginResult>} - Session tokens and user object.
   */
  public async loginWithUser(
    user: CustomUser,
    infos: ConnectionInformations
  ): Promise<LoginResult> {
    const token = await this.createSessionToken(user);
    const sessionId = await this.dbSessions.createSession(user.id, token, infos);

    const { accessToken, refreshToken } = await this.createTokens({
      token,
      user,
    });

    return {
      sessionId,
      tokens: {
        refreshToken,
        accessToken,
      },
      user,
    };
  }

  /**
   * @description Impersonate to another user.
   * For security reasons, even if `useStatelessSession` is set to true the token will be checked against the database.
   * @param {string} accessToken - User access token.
   * @param {object} impersonated - impersonated user.
   * @param {ConnectionInformations} infos - User connection informations.
   * @returns {Promise<Object>} - ImpersonationResult
   * @throws {@link LoginWithServiceErrors}
   */
  public async impersonate(
    accessToken: string,
    impersonated: ImpersonationUserIdentity,
    infos: ConnectionInformations
  ): Promise<ImpersonationResult> {
    try {
      const session = await this.findSessionByAccessToken(accessToken);
      if (!session.valid) {
        throw new AccountsJsError(
          'Session is not valid for user',
          ImpersonateErrors.InvalidSession
        );
      }

      const user = await this.db.findUserById(session.userId);
      if (!user) {
        throw new AccountsJsError('User not found', ImpersonateErrors.UserNotFound);
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
        if (this.options.ambiguousErrorMessages) {
          return { authorized: false };
        }
        throw new AccountsJsError(
          `Impersonated user not found`,
          ImpersonateErrors.ImpersonatedUserNotFound
        );
      }

      if (!this.options.impersonationAuthorize) {
        return { authorized: false };
      }

      const isAuthorized = await this.options.impersonationAuthorize(user, impersonatedUser);
      if (!isAuthorized) {
        return { authorized: false };
      }

      const token = await this.createSessionToken(impersonatedUser);
      const newSessionId = await this.dbSessions.createSession(impersonatedUser.id, token, infos, {
        impersonatorUserId: user.id,
      });

      const impersonationTokens = await this.createTokens({
        token,
        isImpersonated: true,
        user,
      });
      const impersonationResult = {
        authorized: true,
        tokens: impersonationTokens,
        user: this.sanitizeUser(impersonatedUser),
      };

      await this.hooks.emit(ServerHooks.ImpersonationSuccess, {
        user,
        impersonationResult,
        sessionId: newSessionId,
      });

      return impersonationResult;
    } catch (e) {
      await this.hooks.emit(ServerHooks.ImpersonationError, e);

      throw e;
    }
  }

  /**
   * @description Refresh a user token.
   * @param {string} accessToken - User access token.
   * @param {string} refreshToken - User refresh token.
   * @param {ConnectionInformations} infos - User connection informations.
   * @returns {Promise<Object>} - LoginResult.
   * @throws {@link RefreshTokensErrors}
   */
  public async refreshTokens(
    accessToken: string,
    refreshToken: string,
    infos: ConnectionInformations
  ): Promise<LoginResult> {
    try {
      if (!isString(accessToken) || !isString(refreshToken)) {
        throw new AccountsJsError(
          'An accessToken and refreshToken are required',
          RefreshTokensErrors.InvalidTokens
        );
      }

      let sessionToken: string;
      try {
        jwt.verify(refreshToken, this.getSecretOrPublicKey());
        const decodedAccessToken = jwt.verify(accessToken, this.getSecretOrPublicKey(), {
          ignoreExpiration: true,
        }) as { data: JwtData };
        sessionToken = decodedAccessToken.data.token;
      } catch (err) {
        throw new AccountsJsError(
          'Tokens are not valid',
          RefreshTokensErrors.TokenVerificationFailed
        );
      }

      const session: Session | null = await this.dbSessions.findSessionByToken(sessionToken);
      if (!session) {
        throw new AccountsJsError('Session not found', RefreshTokensErrors.SessionNotFound);
      }

      if (session.valid) {
        const user = await this.db.findUserById(session.userId);
        if (!user) {
          throw new AccountsJsError('User not found', RefreshTokensErrors.UserNotFound);
        }

        let newToken;
        if (this.options.createNewSessionTokenOnRefresh) {
          newToken = await this.createSessionToken(user);
        }

        const tokens = await this.createTokens({ token: newToken || sessionToken, user });
        await this.dbSessions.updateSession(session.id, infos, newToken);

        const result = {
          sessionId: session.id,
          tokens,
          user,
          infos,
        };
        await this.hooks.emit(ServerHooks.RefreshTokensSuccess, result);

        return result;
      } else {
        throw new AccountsJsError('Session is no longer valid', RefreshTokensErrors.InvalidSession);
      }
    } catch (err) {
      await this.hooks.emit(ServerHooks.RefreshTokensError, err);

      throw err;
    }
  }

  /**
   * @description Refresh a user token.
   * @param {string} token - User session token.
   * @param {boolean} isImpersonated - Should be true if impersonating another user.
   * @param {User} user - The user object.
   * @returns {Promise<Tokens>} - Return a new accessToken and refreshToken.
   */
  public async createTokens({
    token,
    isImpersonated = false,
    user,
  }: {
    token: string;
    isImpersonated?: boolean;
    user: CustomUser;
  }): Promise<Tokens> {
    const { tokenConfigs } = this.options;
    const jwtData: JwtData = {
      token,
      isImpersonated,
      userId: user.id,
    };

    const accessToken = generateAccessToken({
      payload: await this.createJwtPayload(jwtData, user),
      secret: this.getSecretOrPrivateKey(),
      config: tokenConfigs.accessToken,
    });
    const refreshToken = generateRefreshToken({
      secret: this.getSecretOrPrivateKey(),
      config: tokenConfigs.refreshToken,
    });

    return { accessToken, refreshToken };
  }

  /**
   * @description Logout a user and invalidate his session.
   * @param {string} accessToken - User access token.
   * @returns {Promise<void>} - Return a promise.
   * @throws {@link LogoutErrors}
   */
  public async logout(accessToken: string): Promise<void> {
    try {
      const session: Session = await this.findSessionByAccessToken(accessToken);

      if (session.valid) {
        await this.dbSessions.invalidateSession(session.id);
        await this.hooks.emit(ServerHooks.LogoutSuccess, {
          session,
          accessToken,
        });
      } else {
        throw new AccountsJsError('Session is no longer valid', LogoutErrors.InvalidSession);
      }
    } catch (error) {
      await this.hooks.emit(ServerHooks.LogoutError, error);

      throw error;
    }
  }

  /**
   * @description Resume the current session associated to the access token. Will throw if the token
   * or the session is invalid.
   * If `useStatelessSession` is false the session validity will be checked against the database.
   * @param accessToken - User JWT access token.
   * @returns Return the user associated to the session.
   * @throws {@link ResumeSessionErrors}
   */
  public async resumeSession(accessToken: string): Promise<CustomUser> {
    try {
      if (!isString(accessToken)) {
        throw new AccountsJsError('An accessToken is required', ResumeSessionErrors.InvalidToken);
      }

      let sessionToken: string;
      let userId: string;
      try {
        const decodedAccessToken = jwt.verify(accessToken, this.getSecretOrPublicKey()) as {
          data: JwtData;
        };
        sessionToken = decodedAccessToken.data.token;
        userId = decodedAccessToken.data.userId;
      } catch (err) {
        throw new AccountsJsError(
          'Tokens are not valid',
          ResumeSessionErrors.TokenVerificationFailed
        );
      }

      if (this.micro) {
        // We need to only verify the access tokens without any additional session logic
        return { id: userId } as CustomUser;
      }

      // If the session is stateful we check the validity of the token against the db
      let session: Session | null = null;
      if (!this.options.useStatelessSession) {
        session = await this.dbSessions.findSessionByToken(sessionToken);
        if (!session) {
          throw new AccountsJsError('Session not found', ResumeSessionErrors.SessionNotFound);
        }
        if (!session.valid) {
          throw new AccountsJsError('Invalid Session', ResumeSessionErrors.InvalidSession);
        }
      }

      const user = await this.db.findUserById(userId);
      if (!user) {
        throw new AccountsJsError('User not found', ResumeSessionErrors.UserNotFound);
      }

      await this.options.resumeSessionValidator?.(user, session!);

      await this.hooks.emit(ServerHooks.ResumeSessionSuccess, { user, accessToken, session });

      return this.sanitizeUser(user);
    } catch (error) {
      await this.hooks.emit(ServerHooks.ResumeSessionError, error);
      throw error;
    }
  }

  /**
   * @description Find a session by his token.
   * @param {string} accessToken
   * @returns {Promise<Session>} - Return a session.
   * @throws {@link FindSessionByAccessTokenErrors}
   */
  public async findSessionByAccessToken(accessToken: string): Promise<Session> {
    if (!isString(accessToken)) {
      throw new AccountsJsError(
        'An accessToken is required',
        FindSessionByAccessTokenErrors.InvalidToken
      );
    }

    let sessionToken: string;
    try {
      const decodedAccessToken = jwt.verify(accessToken, this.getSecretOrPublicKey()) as {
        data: JwtData;
      };
      sessionToken = decodedAccessToken.data.token;
    } catch (err) {
      throw new AccountsJsError(
        'Tokens are not valid',
        FindSessionByAccessTokenErrors.TokenVerificationFailed
      );
    }

    const session: Session | null = await this.dbSessions.findSessionByToken(sessionToken);
    if (!session) {
      throw new AccountsJsError(
        'Session not found',
        FindSessionByAccessTokenErrors.SessionNotFound
      );
    }

    return session;
  }

  /**
   * @description Find a user by his id.
   * @param {string} userId - User id.
   * @returns {Promise<Object>} - Return a user or null if not found.
   */
  public findUserById(userId: string): Promise<CustomUser | null> {
    return this.db.findUserById(userId);
  }

  /**
   * @description Deactivate a user, the user will not be able to login until his account is reactivated.
   * @param {string} userId - User id.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async deactivateUser(userId: string): Promise<void> {
    return this.db.setUserDeactivated(userId, true);
  }

  /**
   * @description Activate a user.
   * @param {string} userId - User id.
   * @returns {Promise<void>} - Return a Promise.
   */
  public async activateUser(userId: string): Promise<void> {
    return this.db.setUserDeactivated(userId, false);
  }

  public prepareMail(
    to: string,
    token: string,
    user: CustomUser,
    pathFragment: string,
    emailTemplate: EmailTemplateType,
    from: string
  ): any {
    if (this.options.prepareMail) {
      return this.options.prepareMail(to, token, user, pathFragment, emailTemplate, from);
    }
    return this.defaultPrepareEmail(to, token, user, pathFragment, emailTemplate, from);
  }

  public sanitizeUser(user: CustomUser): CustomUser {
    const { userObjectSanitizer } = this.options;
    const baseUser = this.options.useInternalUserObjectSanitizer
      ? this.internalUserSanitizer(user)
      : user;

    return userObjectSanitizer(baseUser) as CustomUser;
  }

  private internalUserSanitizer(user: CustomUser): CustomUser {
    // Remove services from the user object
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      services,
      ...sanitizedUser
    } = user;
    return sanitizedUser as any;
  }

  private defaultPrepareEmail(
    to: string,
    token: string,
    user: CustomUser,
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
      html: emailTemplate.html && emailTemplate.html(user, tokenizedUrl),
    };
  }

  private defaultCreateTokenizedUrl(pathFragment: string, token: string): string {
    const siteUrl = this.options.siteUrl;
    return `${siteUrl}/${pathFragment}/${token}`;
  }

  private async createSessionToken(user: CustomUser): Promise<string> {
    return this.options.tokenCreator
      ? this.options.tokenCreator.createToken(user)
      : generateRandomToken();
  }

  private async createJwtPayload(data: JwtData, user: CustomUser): Promise<JwtPayload> {
    return this.options.createJwtPayload
      ? {
          ...(await this.options.createJwtPayload(data, user)),
          data,
        }
      : { data };
  }

  private getSecretOrPublicKey(): jwt.Secret {
    return typeof this.options.tokenSecret === 'string'
      ? this.options.tokenSecret
      : this.options.tokenSecret.publicKey;
  }

  private getSecretOrPrivateKey(): jwt.Secret {
    return typeof this.options.tokenSecret === 'string'
      ? this.options.tokenSecret
      : this.options.tokenSecret.privateKey;
  }
}

export default AccountsServer;
