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
    const hasError = isEmpty(trim(email));
    if (hasError && throwError) {
      throw new AccountsError({ message: 'Email is required' });
    }
    return hasError;
  }

  validatePassword(password: ?string, throwError: boolean = true): boolean {
    const hasError = isEmpty(trim(password));
    if (hasError && throwError) {
      throw new AccountsError({ message: 'Password is required' });
    }
    return hasError;
  }

  validateUsername(username: ?string, throwError: boolean = true): boolean {
    const hasError = isEmpty(trim(username));
    if (hasError && throwError) {
      throw new AccountsError({ message: 'Username is required' });
    }
    return hasError;
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
