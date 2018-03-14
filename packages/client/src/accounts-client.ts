import { isFunction, isString, has } from 'lodash';
import { Map } from 'immutable';
import { Store, Middleware } from 'redux';
import * as jwtDecode from 'jwt-decode';
import {
  AccountsError,
  validators,
  CreateUserType,
  LoginUserIdentityType,
  LoginReturnType,
  UserObjectType,
  TokensType,
  ImpersonateReturnType,
} from '@accounts/common';

import config, { TokenStorage, AccountsClientConfiguration } from './config';
import createStore from './create-store';
import reducer, {
  loggingIn,
  setTokens,
  clearTokens as clearStoreTokens,
  setOriginalTokens,
  setImpersonated,
  clearOriginalTokens,
} from './module';
import { TransportInterface } from './transport-interface';

const ACCESS_TOKEN = 'accounts:accessToken';
const REFRESH_TOKEN = 'accounts:refreshToken';
const ORIGINAL_ACCESS_TOKEN = 'accounts:originalAccessToken';
const ORIGINAL_REFRESH_TOKEN = 'accounts:originalRefreshToken';

const getTokenKey = (type: string, options: AccountsClientConfiguration) =>
  isString(options.tokenStoragePrefix) && options.tokenStoragePrefix.length > 0
    ? `${options.tokenStoragePrefix}:${type}`
    : type;

export class AccountsClient {
  private options: AccountsClientConfiguration;
  private transport: TransportInterface;
  private store: Store<object>;
  private storage: TokenStorage;

  constructor(options: AccountsClientConfiguration, transport: TransportInterface) {
    this.options = { ...config, ...options };
    this.storage = options.tokenStorage || config.tokenStorage;
    if (!transport) {
      throw new AccountsError('A REST or GraphQL transport is required');
    }

    this.transport = transport;

    const middleware: Middleware[] = options.reduxLogger ? [options.reduxLogger] : [];

    const reduxStoreKey = options.reduxStoreKey || config.reduxStoreKey;
    this.store =
      options.store ||
      createStore({
        reducers: {
          [reduxStoreKey]: reducer,
        },
        middleware,
      });
  }

  public async config(): Promise<void> {
    await this.loadTokensFromStorage();
    await this.loadOriginalTokensFromStorage();
  }

  public getState(): Map<string, any> {
    const state: object | Map<string, any> = this.store.getState();

    if (typeof (state as Map<string, any>).get === 'function') {
      return (state as Map<string, any>).get(this.options.reduxStoreKey);
    }

    return state[this.options.reduxStoreKey];
  }

  public async getStorageData(keyName: string): Promise<string> {
    return Promise.resolve(this.storage.getItem(keyName));
  }

  public async setStorageData(keyName: string, value: any): Promise<string> {
    return Promise.resolve(this.storage.setItem(keyName, value));
  }

  public async removeStorageData(keyName: string): Promise<string> {
    return Promise.resolve(this.storage.removeItem(keyName));
  }

  public async loadTokensFromStorage(): Promise<void> {
    const tokens = {
      accessToken: (await this.getStorageData(getTokenKey(ACCESS_TOKEN, this.options))) || null,
      refreshToken: (await this.getStorageData(getTokenKey(REFRESH_TOKEN, this.options))) || null,
    };
    this.store.dispatch(setTokens(tokens));
  }

  public async loadOriginalTokensFromStorage(): Promise<void> {
    const tokens = {
      accessToken:
        (await this.getStorageData(getTokenKey(ORIGINAL_ACCESS_TOKEN, this.options))) || null,
      refreshToken:
        (await this.getStorageData(getTokenKey(ORIGINAL_REFRESH_TOKEN, this.options))) || null,
    };
    this.store.dispatch(setOriginalTokens(tokens));
  }

  public async impersonate(username: string): Promise<ImpersonateReturnType> {
    if (!isString(username)) {
      throw new AccountsError('Username is required');
    }
    if (this.isImpersonated()) {
      throw new AccountsError('User already impersonating');
    }
    const { accessToken, refreshToken } = await this.tokens();

    if (!accessToken) {
      throw new AccountsError('There is no access tokens available');
    }

    const res = await this.transport.impersonate(accessToken, username);
    if (!res.authorized) {
      throw new AccountsError(`User unauthorized to impersonate ${username}`);
    } else {
      const { persistImpersonation } = this.options;
      this.store.dispatch(setImpersonated(true));
      this.store.dispatch(setOriginalTokens({ accessToken, refreshToken }));

      if (persistImpersonation) {
        await this.storeOriginalTokens({ accessToken, refreshToken });
        await this.storeTokens(res.tokens);
      }

      this.store.dispatch(setTokens(res.tokens));
      return res;
    }
  }

  public async stopImpersonation(): Promise<void> {
    if (this.isImpersonated()) {
      this.store.dispatch(setTokens(this.originalTokens()));
      this.store.dispatch(clearOriginalTokens());
      this.store.dispatch(setImpersonated(false));
      await this.refreshSession();
    }
  }

  public isImpersonated(): boolean {
    return this.getState().get('isImpersonated');
  }

  public originalTokens(): TokensType {
    const tokens = this.getState().get('originalTokens');

    return tokens
      ? tokens.toJS()
      : {
          accessToken: null,
          refreshToken: null,
        };
  }

  public tokens(): TokensType {
    const tokens = this.getState().get('tokens');

    return tokens
      ? tokens.toJS()
      : {
          accessToken: null,
          refreshToken: null,
        };
  }

  public async clearTokens(): Promise<void> {
    this.store.dispatch(clearStoreTokens());
    await this.removeStorageData(getTokenKey(ACCESS_TOKEN, this.options));
    await this.removeStorageData(getTokenKey(REFRESH_TOKEN, this.options));
  }

  public async storeTokens(tokens: TokensType): Promise<void> {
    if (tokens) {
      const newAccessToken = tokens.accessToken;
      if (newAccessToken) {
        await this.setStorageData(getTokenKey(ACCESS_TOKEN, this.options), newAccessToken);
      }

      const newRefreshToken = tokens.refreshToken;
      if (newRefreshToken) {
        await this.setStorageData(getTokenKey(REFRESH_TOKEN, this.options), newRefreshToken);
      }
    }
  }
  public async storeOriginalTokens(tokens: TokensType): Promise<void> {
    if (tokens) {
      const originalAccessToken = tokens.accessToken;
      if (originalAccessToken) {
        await this.setStorageData(
          getTokenKey(ORIGINAL_ACCESS_TOKEN, this.options),
          originalAccessToken
        );
      }

      const originalRefreshToken = tokens.refreshToken;
      if (originalRefreshToken) {
        await this.setStorageData(
          getTokenKey(ORIGINAL_REFRESH_TOKEN, this.options),
          originalRefreshToken
        );
      }
    }
  }

  public async resumeSession(): Promise<void> {
    try {
      await this.refreshSession();
      if (this.options.onResumedSessionHook && isFunction(this.options.onResumedSessionHook)) {
        this.options.onResumedSessionHook();
      }
    } catch (err) {
      throw err;
    }
  }

  public async refreshSession(): Promise<void> {
    const { accessToken, refreshToken } = await this.tokens();
    if (accessToken && refreshToken) {
      try {
        this.store.dispatch(loggingIn(true));
        const currentTime = Date.now() / 1000;

        const decodedAccessToken = jwtDecode(accessToken);
        const decodedRefreshToken = jwtDecode(refreshToken);
        // See if accessToken is expired
        if (decodedAccessToken.exp < currentTime) {
          // Request a new token pair
          const refreshedSession: LoginReturnType = await this.transport.refreshTokens(
            accessToken,
            refreshToken
          );

          await this.storeTokens(refreshedSession.tokens);
          this.store.dispatch(setTokens(refreshedSession.tokens));
        } else if (decodedRefreshToken.exp < currentTime) {
          // Refresh token is expired, user must sign back in
          this.clearTokens();
        }
        this.store.dispatch(loggingIn(false));
      } catch (err) {
        this.store.dispatch(loggingIn(false));
        this.clearTokens();
        throw new AccountsError('falsy token provided');
      }
    } else {
      this.clearTokens();
      throw new AccountsError('no tokens provided');
    }
  }

  public async createUser(user: CreateUserType): Promise<void> {
    if (!user) {
      throw new AccountsError(
        'Unrecognized options for create user request',
        {
          username: user && user.username,
          email: user && user.email,
        },
        400
      );
    }

    if (!validators.validateUsername(user.username) && !validators.validateEmail(user.email)) {
      throw new AccountsError('Username or Email is required');
    }

    const userToCreate = {
      ...user,
    };
    try {
      const userId = await this.transport.createUser(userToCreate);
      const { onUserCreated } = this.options;

      if (isFunction(onUserCreated)) {
        try {
          await onUserCreated({ id: userId });
        } catch (err) {
          // tslint:disable-next-line no-console
          console.error(err);
        }
      }
    } catch (err) {
      throw new AccountsError(err.message);
    }
  }

  public async loginWithService(
    service: string,
    credentials: { [key: string]: string | object }
  ): Promise<LoginReturnType> {
    if (!isString(service)) {
      throw new AccountsError('Unrecognized options for login request');
    }

    try {
      this.store.dispatch(loggingIn(true));

      const response = await this.transport.loginWithService(service, credentials);

      this.store.dispatch(loggingIn(false));
      await this.storeTokens(response.tokens);
      this.store.dispatch(setTokens(response.tokens));

      const { onSignedInHook } = this.options;

      if (isFunction(onSignedInHook)) {
        try {
          await onSignedInHook(response);
        } catch (err) {
          // tslint:disable-next-line no-console
          console.error(err);
        }
      }
      return response;
    } catch (err) {
      this.clearTokens();
      this.store.dispatch(loggingIn(false));
      throw new AccountsError(err.message);
    }
  }

  public loggingIn(): boolean {
    return this.getState().get('loggingIn');
  }

  public isLoading(): boolean {
    return this.getState().get('isLoading');
  }

  public async logout(callback?: (err?: Error) => void): Promise<void> {
    try {
      const { accessToken } = await this.tokens();

      if (accessToken) {
        await this.transport.logout(accessToken);
      }

      this.clearTokens();
      if (callback && isFunction(callback)) {
        callback();
      }

      if (this.options.onSignedOutHook) {
        this.options.onSignedOutHook();
      }
    } catch (err) {
      this.clearTokens();
      if (callback && isFunction(callback)) {
        callback(err);
      }
      throw new AccountsError(err.message);
    }
  }

  public async verifyEmail(token: string): Promise<void> {
    try {
      await this.transport.verifyEmail(token);
    } catch (err) {
      throw new AccountsError(err.message);
    }
  }
}

const Accounts = {
  // tslint:disable-next-line no-object-literal-type-assertion
  instance: {} as AccountsClient,
  ui: {},
  async config(
    options: AccountsClientConfiguration,
    transport: TransportInterface
  ): Promise<AccountsClient> {
    this.instance = new AccountsClient(
      {
        ...config,
        ...options,
      },
      transport
    );

    await this.instance.loadTokensFromStorage();
    await this.instance.loadOriginalTokensFromStorage();

    return this.instance;
  },
  options(): AccountsClientConfiguration {
    return this.instance.options;
  },
  createUser(user: CreateUserType, callback?: (err?: Error) => void): Promise<void> {
    return this.instance.createUser(user, callback);
  },
  loginWithService(
    service: string,
    credentials: { [key: string]: string | object }
  ): Promise<LoginReturnType> {
    return this.instance.loginWithService(service, credentials);
  },
  loggingIn(): boolean {
    return this.instance.loggingIn();
  },
  isLoading(): boolean {
    return this.instance.isLoading();
  },
  logout(callback: (err?: Error) => void): Promise<void> {
    return this.instance.logout(callback);
  },
  tokens(): TokensType {
    return this.instance.tokens();
  },
  resumeSession(): Promise<void> {
    return this.instance.resumeSession();
  },
  refreshSession(): Promise<void> {
    return this.instance.refreshSession();
  },
  verifyEmail(token: string): Promise<void> {
    return this.instance.verifyEmail(token);
  },
  requestVerificationEmail(email?: string): Promise<void> {
    return this.instance.requestVerificationEmail(email);
  },
  impersonate(username: string): Promise<any> {
    return this.instance.impersonate(username);
  },
  stopImpersonation(): Promise<void> {
    return this.instance.stopImpersonation();
  },
  isImpersonated(): boolean {
    return this.instance.isImpersonated();
  },
  originalTokens(): TokensType {
    return this.instance.originalTokens();
  },
};

export default Accounts;
