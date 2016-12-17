/* @flow */
import { trim, isEmpty } from 'lodash';
import { AccountsError } from './errors';

// TODO Check that password complexity satisfies the config
// TODO Check that email domain satisifes the config

class AccountsCommon {
  // TODO Handle options
  constructor(options: object) {
    this.options = options;
  }
  validateEmail(email: string, throwError: boolean = true): boolean {
    const hasError = isEmpty(trim(email));
    if (hasError && throwError) {
      throw new AccountsError({ message: 'Email is required' });
    }
    return hasError;
  }
  validatePassword(password: string, throwError: boolean = true) {
    const hasError = isEmpty(trim(password));
    if (hasError && throwError) {
      throw new AccountsError({ message: 'Password is required' });
    }
    return hasError;
  }
  validateUsername(username: string, throwError = true) {
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
