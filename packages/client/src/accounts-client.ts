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

import config, { AccountsClientConfiguration } from './config';
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

import { TokenStorage } from './types';
import { tokenStorageLocal } from './token-storage-local';

const ACCESS_TOKEN = 'accounts:accessToken';
const REFRESH_TOKEN = 'accounts:refreshToken';
const ORIGINAL_ACCESS_TOKEN = 'accounts:originalAccessToken';
const ORIGINAL_REFRESH_TOKEN = 'accounts:originalRefreshToken';

const getTokenKey = (type: string, options: AccountsClientConfiguration) =>
  isString(options.tokenStoragePrefix) && options.tokenStoragePrefix.length > 0
    ? `${options.tokenStoragePrefix}:${type}`
    : type;

// tslint:disable max-classes-per-file

// TODO allow change name of local-storage keys
const defaultOptions = {
  tokenStorage: tokenStorageLocal,
};

export class Test {
  // TODO define options type
  private options: any;
  private transport: TransportInterface;
  private storage: TokenStorage;

  // TODO define options type
  constructor(options: any, transport: TransportInterface) {
    this.options = { ...config, ...options };
    this.storage = this.options.tokenStorage;

    if (!transport) {
      throw new AccountsError('A valid transport is required');
    }
    this.transport = transport;
  }

  /**
   * Get the tokens from the storage
   */
  public async getTokens(): Promise<TokensType | null> {
    const accessToken = await this.storage.getItem(ACCESS_TOKEN);
    const refreshToken = await this.storage.getItem(REFRESH_TOKEN);
    if (!accessToken || !refreshToken) {
      return null;
    }
    return { accessToken, refreshToken };
  }

  /**
   * Store the tokens in the storage
   */
  public async setTokens(tokens: TokensType): Promise<void> {
    await this.storage.setItem(ACCESS_TOKEN, tokens.accessToken);
    await this.storage.setItem(REFRESH_TOKEN, tokens.refreshToken);
  }

  /**
   * Remove the tokens from the storage
   */
  public async clearTokens(): Promise<void> {
    await this.storage.removeItem(ACCESS_TOKEN);
    await this.storage.removeItem(REFRESH_TOKEN);
  }

  /**
   * Refresh the user session
   * If the tokens have expired try to refresh them
   */
  public async refreshSession(): Promise<TokensType | null> {
    const tokens = await this.getTokens();
    if (tokens) {
      try {
        const currentTime = Date.now() / 1000;
        const decodedAccessToken = jwtDecode(tokens.accessToken);
        const decodedRefreshToken = jwtDecode(tokens.refreshToken);
        // See if accessToken is expired
        if (decodedAccessToken.exp < currentTime) {
          // Request a new token pair
          const refreshedSession = await this.transport.refreshTokens(
            tokens.accessToken,
            tokens.refreshToken
          );

          await this.setTokens(refreshedSession.tokens);
          return refreshedSession.tokens;
        } else if (decodedRefreshToken.exp < currentTime) {
          // Refresh token is expired, user must sign back in
          this.clearTokens();
          return null;
        }
        return tokens;
      } catch (err) {
        this.clearTokens();
        throw err;
      }
    }
  }

  /**
   * Logout the user
   * Call the server to invalidate the tokens
   * Clean user local storage
   */
  public async logout(): Promise<void> {
    try {
      const tokens = await this.getTokens();

      // TODO see if needed, No refresh token here ?
      if (tokens.accessToken) {
        await this.transport.logout(tokens.accessToken);
      }

      this.clearTokens();
    } catch (err) {
      this.clearTokens();
      throw err;
    }
  }

  /**
   * Impersonate to another user.
   */
  public async impersonate(impersonated: {
    userId?: string;
    username?: string;
    email?: string;
  }): Promise<ImpersonateReturnType> {
    if (this.isImpersonated()) {
      throw new AccountsError('User already impersonating');
    }
    const tokens = await this.getTokens();

    if (!tokens.accessToken) {
      throw new AccountsError('An access token is required');
    }

    const res = await this.transport.impersonate(tokens.accessToken, impersonated);
    if (!res.authorized) {
      throw new AccountsError(`User unauthorized to impersonate`);
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
}

export class AccountsClient {
  private options: AccountsClientConfiguration;
  private transport: TransportInterface;
  private store: Store<object>;
  private storage: TokenStorage;

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
