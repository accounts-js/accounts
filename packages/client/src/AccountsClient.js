// @flow

import { isFunction, isString, has } from 'lodash';
import type { Map } from 'immutable';
import type { Store } from 'redux';
import jwtDecode from 'jwt-decode';
import { AccountsError, validators } from '@accounts/common';
import type {
  CreateUserType,
  PasswordLoginUserType,
  PasswordLoginUserIdentityType,
  LoginReturnType,
  UserObjectType,
  TokensType,
  PasswordType,
  ImpersonateReturnType,
} from '@accounts/common';
import config from './config';
import createStore from './createStore';
import reducer, {
  loggingIn,
  setUser,
  clearUser,
  setTokens,
  clearTokens as clearStoreTokens,
  setOriginalTokens,
  setImpersonated,
  clearOriginalTokens,
} from './module';
import { hashPassword } from './encryption';
import type { TransportInterface } from './TransportInterface';
import type { TokenStorage, AccountsClientConfiguration } from './config';

const isValidUserObject = (user: PasswordLoginUserIdentityType) => has(user, 'user') || has(user, 'email') || has(user, 'id');

const ACCESS_TOKEN = 'accounts:accessToken';
const REFRESH_TOKEN = 'accounts:refreshToken';
const ORIGINAL_ACCESS_TOKEN = 'accounts:originalAccessToken';
const ORIGINAL_REFRESH_TOKEN = 'accounts:originalRefreshToken';

const getTokenKey = (type: string, options: Object) =>
  (isString(options.tokenStoragePrefix) && options.tokenStoragePrefix.length > 0 ? `${options.tokenStoragePrefix}:${type}` : type);

export class AccountsClient {
  options: AccountsClientConfiguration;
  transport: TransportInterface;
  store: Store<Object, Object>;
  storage: TokenStorage;

  constructor(options: AccountsClientConfiguration, transport: TransportInterface) {
    this.options = options;
    this.storage = options.tokenStorage || config.tokenStorage;
    if (!transport) {
      throw new AccountsError('A REST or GraphQL transport is required');
    }

    this.transport = transport;

    const middleware = options.reduxLogger ? [
      options.reduxLogger,
    ] : [];

    const reduxStoreKey = options.reduxStoreKey || config.reduxStoreKey;
    this.store = options.store || createStore({
      reducers: {
        [reduxStoreKey]: reducer,
      },
      middleware,
    });
  }

  getState(): Map<string, any> {
    const state = this.store.getState();

    if (typeof state.get === 'function') {
      return state.get(this.options.reduxStoreKey);
    }

    return state[this.options.reduxStoreKey];
  }

  async getStorageData(keyName: string): Promise<string> {
    return Promise.resolve(this.storage.getItem(keyName));
  }

  async setStorageData(keyName: string, value: any): Promise<string> {
    return Promise.resolve(this.storage.setItem(keyName, value));
  }

  async removeStorageData(keyName: string): Promise<string> {
    return Promise.resolve(this.storage.removeItem(keyName));
  }

  async loadTokensFromStorage(): Promise<void> {
    const tokens = {
      accessToken: await this.getStorageData(getTokenKey(ACCESS_TOKEN, this.options)) || null,
      refreshToken: await this.getStorageData(getTokenKey(REFRESH_TOKEN, this.options)) || null,
    };
    this.store.dispatch(setTokens(tokens));
  }

  async loadOriginalTokensFromStorage(): Promise<void> {
    const tokens = {
      accessToken: await this.getStorageData(
        getTokenKey(ORIGINAL_ACCESS_TOKEN, this.options)) || null,
      refreshToken: await this.getStorageData(
        getTokenKey(ORIGINAL_REFRESH_TOKEN, this.options)) || null,
    };
    this.store.dispatch(setOriginalTokens(tokens));
  }

  user(): UserObjectType | null {
    const user = this.getState().get('user');

    return user ? user.toJS() : null;
  }

  async impersonate(username: string): Promise<ImpersonateReturnType> {
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
      this.store.dispatch(setUser(res.user));
      return res;
    }
  }

  async stopImpersonation(): Promise<void> {
    if (this.isImpersonated()) {
      this.store.dispatch(setTokens(this.originalTokens()));
      this.store.dispatch(clearOriginalTokens());
      this.store.dispatch(setImpersonated(false));
      await this.refreshSession();
    }
  }

  isImpersonated(): boolean {
    return (this.getState().get('isImpersonated'): boolean);
  }

  originalTokens(): TokensType {
    const tokens = this.getState().get('originalTokens');

    return tokens ? tokens.toJS() : {
      accessToken: null,
      refreshToken: null,
    };
  }

  tokens(): TokensType {
    const tokens = this.getState().get('tokens');

    return tokens ? tokens.toJS() : {
      accessToken: null,
      refreshToken: null,
    };
  }

  async clearTokens(): Promise<void> {
    this.store.dispatch(clearStoreTokens());
    await this.removeStorageData(getTokenKey(ACCESS_TOKEN, this.options));
    await this.removeStorageData(getTokenKey(REFRESH_TOKEN, this.options));
  }

  async storeTokens(tokens: ?TokensType): Promise<void> {
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
  async storeOriginalTokens(tokens: ?TokensType): Promise<void> {
    if (tokens) {
      const originalAccessToken = tokens.accessToken;
      if (originalAccessToken) {
        await this.setStorageData(
          getTokenKey(ORIGINAL_ACCESS_TOKEN, this.options), originalAccessToken);
      }

      const originalRefreshToken = tokens.refreshToken;
      if (originalRefreshToken) {
        await this.setStorageData(
          getTokenKey(ORIGINAL_REFRESH_TOKEN, this.options), originalRefreshToken);
      }
    }
  }

  clearUser() {
    this.store.dispatch(clearUser());
  }

  async resumeSession(): Promise<void> {
    try {
      await this.refreshSession();
      if (this.options.onResumedSessionHook && isFunction(this.options.onResumedSessionHook)) {
        this.options.onResumedSessionHook();
      }
    } catch (err) {
      throw (err);
    }
  }

  async refreshSession(): Promise<void> {
    const { accessToken, refreshToken } = await this.tokens();
    if (accessToken && refreshToken) {
      try {
        this.store.dispatch(loggingIn(true));
        const decodedRefreshToken = jwtDecode(refreshToken);
        const currentTime = Date.now() / 1000;
        // Refresh token is expired, user must sign back in
        if (decodedRefreshToken.exp < currentTime) {
          this.clearTokens();
          this.clearUser();
        } else {
          // Request a new token pair
          const refreshedSession: LoginReturnType =
            await this.transport.refreshTokens(accessToken, refreshToken);
          this.store.dispatch(loggingIn(false));

          await this.storeTokens(refreshedSession.tokens);
          this.store.dispatch(setTokens(refreshedSession.tokens));
          this.store.dispatch(setUser(refreshedSession.user));
        }
      } catch (err) {
        this.store.dispatch(loggingIn(false));
        this.clearTokens();
        this.clearUser();
        throw new AccountsError('falsy token provided');
      }
    } else {
      this.clearTokens();
      this.clearUser();
      throw new AccountsError('no tokens provided');
    }
  }

  async createUser(user: CreateUserType, callback: ?Function): Promise<void> {
    if (!user || user.password === undefined) {
      throw new AccountsError(
        'Unrecognized options for create user request',
        {
          username: user && user.username,
          email: user && user.email,
        },
        400,
      );
    }

    // In case where password is an object we assume it was prevalidated and hashed
    if (!user.password ||
        (isString(user.password) && !validators.validatePassword(user.password))) {
      throw new AccountsError('Password is required');
    }

    if (!validators.validateUsername(user.username) && !validators.validateEmail(user.email)) {
      throw new AccountsError('Username or Email is required');
    }

    const hashAlgorithm = this.options.passwordHashAlgorithm;
    const password = (user.password && hashAlgorithm) ?
      hashPassword(user.password, hashAlgorithm) : user.password;
    const userToCreate = { ...user, password };
    try {
      const userId = await this.transport.createUser(userToCreate);
      const { onUserCreated } = this.options;
      if (callback && isFunction(callback)) {
        callback();
      }
      if (isFunction(onUserCreated)) {
        try {
          await onUserCreated({ id: userId });
        } catch (err) {
          console.log(err);
        }
      }
      await this.loginWithPassword({ id: userId }, user.password);
    } catch (err) {
      if (callback && isFunction(callback)) {
        callback(err);
      }
      throw new AccountsError(err.message);
    }
  }

  async loginWithPassword(user: PasswordLoginUserType,
                          password: ?PasswordType,
                          callback?: Function): Promise<LoginReturnType> {
    if (!password || !user) {
      throw new AccountsError('Unrecognized options for login request', user, 400);
    }
    if ((!isString(user) && !isValidUserObject(user)) || !isString(password)) {
      throw new AccountsError('Match failed', user, 400);
    }

    this.store.dispatch(loggingIn(true));
    try {
      const hashAlgorithm = this.options.passwordHashAlgorithm;
      const pass = hashAlgorithm ? hashPassword(password, hashAlgorithm) : password;
      const res: LoginReturnType = await this.transport.loginWithPassword(user, pass);

      this.store.dispatch(loggingIn(false));
      await this.storeTokens(res.tokens);
      this.store.dispatch(setTokens(res.tokens));
      this.store.dispatch(setUser(res.user));

      if (this.options.onSignedInHook && isFunction(this.options.onSignedInHook)) {
        this.options.onSignedInHook();
      }

      if (callback && isFunction(callback)) {
        callback(null, res);
      }

      return res;
    } catch (err) {
      this.store.dispatch(loggingIn(false));
      if (callback && isFunction(callback)) {
        callback(err, null);
      }
      throw new AccountsError(err.message);
    }
  }

  loggingIn(): boolean {
    return (this.getState().get('loggingIn'): boolean);
  }

  isLoading(): boolean {
    return (this.getState().get('isLoading'): boolean);
  }

  async logout(callback: ?Function): Promise<void> {
    try {
      const { accessToken } = await this.tokens();

      if (accessToken) {
        await this.transport.logout(accessToken);
      }

      this.clearTokens();
      this.store.dispatch(clearUser());
      if (callback && isFunction(callback)) {
        callback();
      }

      if (this.options.onSignedOutHook) {
        this.options.onSignedOutHook();
      }
    } catch (err) {
      this.clearTokens();
      this.store.dispatch(clearUser());
      if (callback && isFunction(callback)) {
        callback(err);
      }
      throw new AccountsError(err.message);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await this.transport.verifyEmail(token);
    } catch (err) {
      throw new AccountsError(err.message);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!validators.validatePassword(newPassword)) {
      throw new AccountsError('Password is invalid!');
    }

    const hashAlgorithm = this.options.passwordHashAlgorithm;
    const password = hashAlgorithm ? hashPassword(newPassword, hashAlgorithm) : newPassword;

    try {
      await this.transport.resetPassword(token, password);
    } catch (err) {
      throw new AccountsError(err.message);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    if (!validators.validateEmail(email)) throw new AccountsError('Valid email must be provided');
    try {
      await this.transport.sendResetPasswordEmail(email);
    } catch (err) {
      throw new AccountsError(err.message);
    }
  }

  async requestVerificationEmail(email: string): Promise<void> {
    if (!validators.validateEmail(email)) throw new AccountsError('Valid email must be provided');
    try {
      await this.transport.sendVerificationEmail(email);
    } catch (err) {
      throw new AccountsError(err.message);
    }
  }
}

const Accounts = {
  instance: AccountsClient,
  ui: {},
  async config(options: AccountsClientConfiguration,
               transport: TransportInterface): Promise<AccountsClient> {
    this.instance = new AccountsClient({
      ...config,
      ...options,
    }, transport);

    await this.instance.loadTokensFromStorage();
    await this.instance.loadOriginalTokensFromStorage();

    return this.instance;
  },
  user(): UserObjectType | null {
    return this.instance.user();
  },
  options(): AccountsClientConfiguration {
    return this.instance.options;
  },
  createUser(user: CreateUserType, callback: ?Function): Promise<void> {
    return this.instance.createUser(user, callback);
  },
  loginWithPassword(user: PasswordLoginUserType,
                    password: string,
                    callback?: Function): Promise<void> {
    return this.instance.loginWithPassword(user, password, callback);
  },
  loggingIn(): boolean {
    return this.instance.loggingIn();
  },
  isLoading(): boolean {
    return this.instance.isLoading();
  },
  logout(callback: ?Function): Promise<void> {
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
  resetPassword(token: string, newPassword: string): Promise<void> {
    return this.instance.resetPassword(token, newPassword);
  },
  requestPasswordReset(email?: string): Promise<void> {
    return this.instance.requestPasswordReset(email);
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

// TODO Could this be handled better?
// if (typeof window !== 'undefined') {
//   window.onload = async () => {
//     if (Accounts.instance && Accounts.instance.resumeSession) {
//       await Accounts.resumeSession();
//     }
//   };
// }
