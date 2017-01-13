// @flow

import { isFunction, isString, has } from 'lodash';
import type { Map } from 'immutable';
import type { Store } from 'redux';
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
      localStorage.setItem('accounts:accessToken', res.session.accessToken);
      localStorage.setItem('accounts:refreshToken', res.session.refreshToken);
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
};

export default Accounts;
