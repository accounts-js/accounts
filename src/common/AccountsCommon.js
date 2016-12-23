// @flow

import { trim, isEmpty } from 'lodash';
import { AccountsError } from './errors';

// TODO Check that password complexity satisfies the config
// TODO Check that email domain satisifes the config

export type AccountsOptionsType = {};

export default class AccountsCommon {

  // TODO Handle options
  constructor(options: AccountsOptionsType) {
    this.options = options;
  }

  validateEmail(email: ?string, throwError: boolean = true): boolean {
    const isValid = !isEmpty(trim(email));
    if (!isValid && throwError) {
      throw new AccountsError({ message: 'Email is required' });
    }
    return isValid;
  }

  validatePassword(password: ?string, throwError: boolean = true): boolean {
    const isValid = !isEmpty(trim(password));
    if (!isValid && throwError) {
      throw new AccountsError({ message: 'Password is required' });
    }
    return isValid;
  }

  validateUsername(username: ?string, throwError: boolean = true): boolean {
    const isValid = !isEmpty(trim(username));
    if (!isValid && throwError) {
      throw new AccountsError({ message: 'Username is required' });
    }
    return isValid;
  }

  userId(): ?string {

  }

  user() {

  }

  config(options: AccountsOptionsType) {
    this.options = { ...this.options, options };
  }

  onLogin(cb: Function) {
    this.onLogin = cb;
  }

  onLoginFailure(cb: Function) {
    this.onLoginFailure = cb;
  }

  onLogout(cb: Function) {
    this.onLogout = cb;
  }

  options: AccountsOptionsType;
  onLogin: Function;
  onLoginFailure: Function;
  onLogout: Function;
}
