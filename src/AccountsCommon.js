const defaultConfig = {
  sendVerificationEmail: false,
  forbidClientAccountCreation: false,
  restrictCreationByEmailDomain: null,
  loginExpirationInDays: 90,
  // TODO Investigate oauthSecretKey
  // oauthSecretKey
  passwordResetTokenExpirationInDays: 3,
  passwordEnrollTokenExpirationInDays: 30,
};

class AccountsCommon {
  // TODO Handle options
  constuctor(options) {
    this.accountsConfig = defaultConfig;
  }
  userId() {

  }
  user() {

  }
  config(config) {
    this.accountsConfig = { ...this.accountsConfig, config };
  }
  onLogin(func) {
    this.onLogin = func;
  }
  onLoginFailure(func) {
    this.onLoginFailure = func;
  }
  onLogout(func) {
    this.onLogout = func;
  }
  createUser(options, callback) {

  }
}

export default AccountsCommon;
