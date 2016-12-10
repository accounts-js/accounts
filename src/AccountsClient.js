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
  createUser(options, callback) {

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
