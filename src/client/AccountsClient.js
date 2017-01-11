// @flow

import { isFunction, isString, has } from 'lodash';
import type { Map } from 'immutable';

import { defaultClientConfig } from '../common/defaultConfigs';
import { AccountsError } from '../common/errors';
import store from './store';
import { loggingIn } from './module';
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '../common/validators';
import type { TransportInterface } from './TransportInterface';
import type {
  CreateUserType,
  PasswordLoginUserType,
} from '../common/types';

const isValidUserObject = (user: PasswordLoginUserType) => has(user, 'user') || has(user, 'email') || has(user, 'id');

export class AccountsClient {
  options: Object
  transport: TransportInterface

  constructor(options: Object, transport: TransportInterface) {
    this.options = options;
    if (!transport) {
      throw new AccountsError({
        message: 'A REST or GraphQL transport is required',
      });
    }

    this.transport = transport;
  }

  getState(): Map<string, any> {
    return store.getState().get('accounts');
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
      await this.transport.createUser(user);

      if (callback && isFunction(callback)) {
        callback();
      }
      // TODO Login user on succesfull completion
    } catch (err) {
      if (callback && isFunction(callback)) {
        callback(err);
        throw new AccountsError({ message: err });
      }
    }
  }

  async loginWithPassword(user: PasswordLoginUserType,
                          password: string,
                          callback: Function): Promise<void> {
    if (!password || !user) {
      throw new AccountsError({ message: 'Unrecognized options for login request [400]' });
    }
    if ((!isString(user) && !isValidUserObject(user)) || !isString(password)) {
      throw new AccountsError({ message: 'Match failed [400]' });
    }

    store.dispatch(loggingIn(true));
    try {
      await this.transport.loginWithPassword(user, password);

      // TODO Update redux store with user info
      if (isFunction(callback)) {
        callback();
      }
    } catch (err) {
      if (isFunction(callback)) {
        callback(err);
        throw new AccountsError({ message: err });
      }
    }
    store.dispatch(loggingIn(false));
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
