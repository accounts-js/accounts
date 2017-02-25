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
} from '@accounts/common';
import config from './config';
import createStore from './createStore';
import reducer, { loggingIn, setUser, clearUser } from './module';
import type { TransportInterface } from './TransportInterface';

const isValidUserObject = (user: PasswordLoginUserIdentityType) => has(user, 'user') || has(user, 'email') || has(user, 'id');

const ACCESS_TOKEN = 'accounts:accessToken';
const REFRESH_TOKEN = 'accounts:refreshToken';

const getTokenKey = (type: string, options: Object) =>
  (isString(options.tokenStoragePrefix) && options.tokenStoragePrefix.length > 0 ? `${options.tokenStoragePrefix}:${type}` : type);

export interface TokenStorage {
  getItem(key: string): Promise<string>,
  removeItem(key: string): Promise<string>,
  setItem(key: string, value: string): Promise<string>
}

export class AccountsClient {
  options: Object;
  transport: TransportInterface;
  store: Store<Map<string, any>, Object>;
  storage: TokenStorage;

  constructor(options: Object, transport: TransportInterface) {
    this.options = options;
    this.storage = options.tokenStorage;
    if (!transport) {
      throw new AccountsError('A REST or GraphQL transport is required');
    }

    this.transport = transport;

    const middleware = options.reduxLogger ? [
      options.reduxLogger,
    ] : [];

    this.store = options.store || createStore({
      reducers: {
        [options.reduxStoreKey]: reducer,
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

  user(): UserObjectType {
    return this.getState().get('user').toJS();
  }

  async tokens(): Promise<TokensType> {
    return {
      accessToken: await this.getStorageData(getTokenKey(ACCESS_TOKEN, this.options)),
      refreshToken: await this.getStorageData(getTokenKey(REFRESH_TOKEN, this.options)),
    };
  }

  async clearTokens(): Promise<void> {
    await this.removeStorageData(getTokenKey(ACCESS_TOKEN, this.options));
    await this.removeStorageData(getTokenKey(REFRESH_TOKEN, this.options));
  }

  async storeTokens(loginResponse: LoginReturnType): Promise<void> {
    const newAccessToken = loginResponse.tokens.accessToken;
    if (newAccessToken) {
      await this.setStorageData(getTokenKey(ACCESS_TOKEN, this.options), newAccessToken);
    }

    const newRefreshToken = loginResponse.tokens.refreshToken;
    if (newRefreshToken) {
      await this.setStorageData(getTokenKey(REFRESH_TOKEN, this.options), newRefreshToken);
    }
  }

  clearUser() {
    this.store.dispatch(clearUser());
  }

  resumeSession(): Promise<void> {
    // TODO Should there be any additional resume session logic here?
    return this.refreshSession();
  }

  async refreshSession(): Promise<void> {
    const { accessToken, refreshToken } = await this.tokens();
    if (accessToken && refreshToken) {
      try {
        const decodedRefreshToken = jwtDecode(refreshToken);
        const currentTime = Date.now() / 1000;
        // Refresh token is expired, user must sign back in
        if (decodedRefreshToken.exp < currentTime) {
          this.clearTokens();
          this.clearUser();
        } else {
          // Request a new token pair
          const refreshedSession : LoginReturnType =
            await this.transport.refreshTokens(accessToken, refreshToken);

          await this.storeTokens(refreshedSession);
          this.store.dispatch(setUser(refreshedSession.user));
        }
      } catch (err) {
        this.clearTokens();
        this.clearUser();
        throw new AccountsError('falsy token provided');
      }
    } else {
      this.clearTokens();
      this.clearUser();
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

    if (!validators.validatePassword(user.password)) {
      throw new AccountsError('Password is required');
    }

    if (!validators.validateUsername(user.username) && !validators.validateEmail(user.email)) {
      throw new AccountsError('Username or Email is required');
    }

    try {
      const userId = await this.transport.createUser(user);
      if (callback && isFunction(callback)) {
        callback();
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
                          password: ?string,
                          callback?: Function): Promise<void> {
    if (!password || !user) {
      throw new AccountsError('Unrecognized options for login request', user, 400);
    }
    if ((!isString(user) && !isValidUserObject(user)) || !isString(password)) {
      throw new AccountsError('Match failed', user, 400);
    }

    this.store.dispatch(loggingIn(true));
    try {
      const res : LoginReturnType = await this.transport.loginWithPassword(user, password);
      await this.storeTokens(res);
      this.store.dispatch(setUser(res.user));
      this.options.onSignedInHook();
      if (callback && isFunction(callback)) {
        callback();
      }
    } catch (err) {
      if (callback && isFunction(callback)) {
        callback(err);
      }
      throw new AccountsError(err.message);
    }
    this.store.dispatch(loggingIn(false), user);
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
      this.options.onSignedOutHook();
    } catch (err) {
      if (callback && isFunction(callback)) {
        callback(err);
      }
      throw new AccountsError(err.message);
    }
  }
}

const Accounts = {
  instance: AccountsClient,
  ui: {},
  config(options: Object, transport: TransportInterface) {
    this.instance = new AccountsClient({
      ...config,
      ...options,
    }, transport);
  },
  user(): UserObjectType {
    return this.instance.user();
  },
  options(): Object {
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
