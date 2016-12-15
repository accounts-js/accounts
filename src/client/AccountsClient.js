import { isFunction, isString, isObject, has } from 'lodash';
import { defaultClientConfig } from '../common/defaultConfigs';
import { AccountsError } from '../common/errors';
import store from './store';
import AccountsCommon from '../common/AccountsCommon';
import { loggingIn } from './module';

const isValidUserObject = user => has(user, 'user') || has(user, 'email') || has(user, 'id');

class Accounts extends AccountsCommon {
  constructor(options, client) {
    super(options);
    if (!client) {
      throw new AccountsError({
        message: 'A REST or GraphQL client is required',
      });
    }
    this.store = store;
    this.client = client;
  }
  getState() {
    return this.getState().get('accounts');
  }
  // TODO Accept 'profile' in the options
  async createUser({ password, username, email }, callback) {
    this.validatePassword(password);
    // TODO Throw error if client user creation is disabled

    if (!this.validateUsername(username, false) && !this.validateEmail(email, false)) {
      throw new AccountsError({ message: 'Username or Email is required' });
    }
    try {
      const res = await this.client.createUser({
        password,
        username,
        email,
      });
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
  async loginWithPassword(user, password, callback) {
    if (!password || !user) {
      throw new AccountsError({ message: 'Unrecognized options for login request [400]' });
    }
    if ((!isString(user) && !isValidUserObject(user)) || !isString(password)) {
      throw new AccountsError({ message: 'Match failed [400]' });
    }

    this.store.dispatch(loggingIn(true));
    try {
      const res = await this.client.loginWithPassword(user, password);
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
    this.store.dispatch(loggingIn(false));
    // TODO User not found
    // TODO Incorrect password
    // TODO User has no password set
  }
  // loginWith(service, options, callback) {
  //
  // }
  loggingIn() {
    return this.getState().get('loggingIn');
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
}


const AccountsClient = {
  config(options, client) {
    this.instance = new Accounts({
      ...defaultClientConfig,
      ...options,
    }, client);
  },
  createUser(...args) {
    return this.instance.createUser(...args);
  },
  loginWithPassword(...args) {
    return this.instance.loginWithPassword(...args);
  },
};

export default AccountsClient;
