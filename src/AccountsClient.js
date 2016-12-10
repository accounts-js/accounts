import { isFunction, trim, isEmpty } from 'lodash';
import AccountsCommon from './AccountsCommon';
import createStore from './createStore';
import reducer from './module';

class AccountsClient extends AccountsCommon {
  // TODO Handle options
  constructor(options) {
    super(options);
    this.store = createStore({
      reducers: {
        accounts: reducer,
      },
    });
  }
  async createUser({ password, username, email }, callback) {
    // TODO Throw error if client user creation is disabled
    // TODO Check that password complexity satisfies the config
    if (isEmpty(trim(password))) {
      throw new Error('Password is required');
    }
    // TODO Check that email domain satisifes the config
    if (isEmpty(trim(email)) && isEmpty(trim(username))) {
      throw new Error('Username or Email is required');
    }
    if (isFunction(callback)) {
      callback();
    }
  }
  loginWithPassword(user, password, callback) {

  }
  loginWith(service, options, callback) {

  }
  loggingIn() {

  }
  logout(callback) {

  }
  logoutOtherClients(callback) {

  }
  changePassword(oldPassword, newPassword, callback) {

  }
  resetPassword(token, newPassword, callback) {

  }
  onResetPasswordLink(callback) {

  }
  onEnrollmentLink(callback) {

  }
  onEmailVerificationLink(callback) {

  }

}

export default AccountsClient;
