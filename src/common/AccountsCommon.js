import { trim, isEmpty } from 'lodash';
import { AccountsError } from './errors';

// TODO Check that password complexity satisfies the config
// TODO Check that email domain satisifes the config

class AccountsCommon {
  // TODO Handle options
  constructor(options) {
    this.options = options;
  }
  validateEmail(email, throwError = true) {
    const hasError = isEmpty(trim(email));
    if (hasError && throwError) {
      throw new AccountsError({ message: 'Email is required' });
    }
    return hasError;
  }
  validatePassword(password, throwError = true) {
    const hasError = isEmpty(trim(password));
    if (hasError && throwError) {
      throw new AccountsError({ message: 'Password is required' });
    }
    return hasError;
  }
  validateUsername(username, throwError = true) {
    const hasError = isEmpty(trim(username));
    if (hasError && throwError) {
      throw new AccountsError({ message: 'Username is required' });
    }
    return hasError;
  }
  userId() {

  }
  user() {

  }
  config(config) {
    this.config = { ...this.config, config };
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
}

export default AccountsCommon;
