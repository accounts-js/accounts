import { isFunction } from 'lodash';
import { defaultClientConfig } from '../common/defaultConfigs';
import { AccountsError } from '../common/errors';
import store from './store';
import AccountsCommon from '../common/AccountsCommon';

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
  // loginWithPassword(user, password, callback) {
  //
  // }
  // loginWith(service, options, callback) {
  //
  // }
  // loggingIn() {
  //
  // }
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
};

export default AccountsClient;
