// @flow

import { isFunction, isString, has } from 'lodash';
import type { Map } from 'immutable';

import { defaultClientConfig } from '../common/defaultConfigs';
import { AccountsError } from '../common/errors';
import store from './store';
import AccountsCommon from '../common/AccountsCommon';
import { loggingIn } from './module';
import type { AccountsOptionsType } from '../common/AccountsCommon';
import type UserObjectType from '../common/UserObjectType';

const isValidUserObject = (user: UserObjectType) => has(user, 'user') || has(user, 'email') || has(user, 'id');

export type UserCreationInputType = {
  username: ?string,
  password: string,
  email: ?string,
  profile: ?Object
};

export type AccountTokenType = {
  token: string,
  tokenExpiration: Date,
  userId: ?string
};

export interface AccountsTransportClient {
  createUser(user: UserCreationInputType): AccountTokenType,
  loginWithPassword(user: UserObjectType, password: string): AccountTokenType
}

class Accounts extends AccountsCommon {

  constructor(options: AccountsOptionsType, client: AccountsTransportClient) {
    super(options);
    if (!client) {
      throw new AccountsError({
        message: 'A REST or GraphQL client is required',
      });
    }

    this.client = client;
  }

  getState(): Map<string, any> {
    return store.getState().get('accounts');
  }

  // TODO Accept 'profile' in the options
  async createUser(user: UserCreationInputType, callback: ?Function): Promise<void> {
    this.validatePassword(user.password);
    // TODO Throw error if client user creation is disabled

    if (!this.validateUsername(user.username, false) && !this.validateEmail(user.email, false)) {
      throw new AccountsError({ message: 'Username or Email is required' });
    }
    try {
      await this.client.createUser(user);

      if (isFunction(callback)) {
        callback();
      }
      // TODO Login user on succesfull completion
    } catch (err) {
      if (isFunction(callback)) {
        callback(err);
        throw new AccountsError({ message: err });
      }
    }
  }

  async loginWithPassword(user: UserObjectType,
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
      await this.client.loginWithPassword(user, password);
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

  // loginWith(service, options, callback) {
  //
  // }
  loggingIn(): boolean {
    return (this.getState().get('loggingIn'): boolean);
  }

  // logout(callback) {
  //
  // }
  // logoutOtherClients(callback) {
  //
  // }
  // changePassword(oldPassword, newPassword, callback) {
  //
  // }
  // resetPassword(token, newPassword, callback) {
  //
  // }
  // onResetPasswordLink(callback) {
  //
  // }
  // onEnrollmentLink(callback) {
  //
  // }
  // onEmailVerificationLink(callback) {
  //
  // }

  client: AccountsTransportClient;
}


const AccountsClient = {
  ui: {

  },
  config(options: AccountsOptionsType, client: AccountsTransportClient) {
    this.instance = new Accounts({
      ...defaultClientConfig,
      ...options,
    }, client);
  },
  createUser(...args: Array<mixed>): Promise<void> {
    return this.instance.createUser(...args);
  },
  loginWithPassword(...args: Array<mixed>): Promise<void> {
    return this.instance.loginWithPassword(...args);
  },
  options(): AccountsOptionsType {
    return this.instance.options;
  },
};

export default AccountsClient;
