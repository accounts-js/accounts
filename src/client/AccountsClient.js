// @flow

import { isFunction, isString, has } from 'lodash';
import type { Map } from 'immutable';
import type { Store } from 'redux';
import jwtDecode from 'jwt-decode';
import createStore from './createStore';
import { defaultClientConfig } from '../common/defaultConfigs';
import { AccountsError } from '../common/errors';
import reducer, { loggingIn, setUser } from './module';
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '../common/validators';
import type { TransportInterface } from './TransportInterface';
import type {
  CreateUserType,
  PasswordLoginUserType,
  LoginReturnType,
  UserObjectType,
  TokensType,
} from '../common/types';

const isValidUserObject = (user: PasswordLoginUserType) => has(user, 'user') || has(user, 'email') || has(user, 'id');


export class AccountsClient {
  options: Object
  transport: TransportInterface
  store: Store<Map<string, any>>

  constructor(options: Object, transport: TransportInterface) {
    this.options = options;
    if (!transport) {
      throw new AccountsError({
        message: 'A REST or GraphQL transport is required',
      });
    }

    this.transport = transport;

    const middleware = options.reduxLogger ? [
      options.reduxLogger,
    ] : [];

    this.store = createStore({
      reducers: {
        accounts: reducer,
      },
      middleware,
    });
  }
  getState(): Map<string, any> {
    return this.store.getState().get('accounts');
  }
  user(): UserObjectType {
    return this.getState().get('user').toJS();
  }
  tokens(): TokensType {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  }
  async resumeSession(): Promise<void> {
    console.log('Resuming session');
    const { accessToken, refreshToken } = this.tokens();
    if (accessToken) {
      try {
        const decodedAccessToken = jwtDecode(accessToken);
        console.log(decodedAccessToken);
        if (decodedAccessToken.exp < Date.now() / 1000) {
          console.log('need to refresh session');
          // Try to refresh session
        } else {
          const sessionId = decodedAccessToken.data.sessionId;
          const user: UserObjectType = await this.transport.resumeSession(sessionId);
          console.log(user);
          this.store.dispatch(setUser(user));
        }
      } catch (err) {
        throw new AccountsError({ message: 'falsy access token provided' });
      }
    }
  }
  async createUser(user: CreateUserType, callback: ?Function): Promise<void> {
    if (!user || user.password === undefined) {
      throw new AccountsError({ message: 'Unrecognized options for create user request [400]' });
    }

    if (!validatePassword(user.password)) {
      throw new AccountsError({ message: 'Password is required' });
    }

    if (!validateUsername(user.username) && !validateEmail(user.email)) {
      throw new AccountsError({ message: 'Username or Email is required' });
    }

    try {
      const userId = await this.transport.createUser(user);
      if (callback && isFunction(callback)) {
        callback();
      }
      // $FlowFixMe
      await this.loginWithPassword({ id: userId }, user.password);
    } catch (err) {
      if (callback && isFunction(callback)) {
        callback(err);
      }
      throw new AccountsError({ message: err.message });
    }
  }

  async loginWithPassword(user: PasswordLoginUserType,
                          password: string,
                          callback: ?Function): Promise<void> {
    if (!password || !user) {
      throw new AccountsError({ message: 'Unrecognized options for login request [400]' });
    }
    if ((!isString(user) && !isValidUserObject(user)) || !isString(password)) {
      throw new AccountsError({ message: 'Match failed [400]' });
    }

    this.store.dispatch(loggingIn(true));
    try {
      const res : LoginReturnType = await this.transport.loginWithPassword(user, password);
      localStorage.setItem('accounts:accessToken', res.tokens.accessToken);
      localStorage.setItem('accounts:refreshToken', res.tokens.refreshToken);
      this.store.dispatch(setUser(res.user));
      this.options.onSignedInHook();
      if (callback && isFunction(callback)) {
        callback();
      }
    } catch (err) {
      if (callback && isFunction(callback)) {
        callback(err);
      }
      throw new AccountsError({ message: err.message });
    }
    this.store.dispatch(loggingIn(false));
  }
  loggingIn(): boolean {
    return (this.getState().get('loggingIn'): boolean);
  }
  isLoading(): boolean {
    return (this.getState().get('isLoading'): boolean);
  }
  async logout(callback: ?Function): Promise<void> {
    try {
      await this.transport.logout();
      if (callback && isFunction(callback)) {
        callback();
      }
      this.options.onLogout();
    } catch (err) {
      if (callback && isFunction(callback)) {
        callback(err);
      }
    }
  }
}

const Accounts = {
  instance: AccountsClient,
  ui: {

  },
  config(options: Object, transport: TransportInterface) {
    this.instance = new AccountsClient({
      ...defaultClientConfig,
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
                    callback: Function): Promise<void> {
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
    // $FlowFixMe
    return this.instance.resumeSession();
  },
};

export default Accounts;

// TODO Could this be handled better?
if (window) {
  window.onload = async () => {
    if (Accounts.instance) {
      await Accounts.resumeSession();
    }
  };
}
