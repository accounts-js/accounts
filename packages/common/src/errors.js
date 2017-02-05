// @flow

import type { PasswordLoginUserType } from './types';

// eslint-disable-next-line import/prefer-default-export
export class AccountsError extends Error {
  loginInfo: PasswordLoginUserType;
  errorCode: string | number;
  epochTime: number;

  constructor(message: string, loginInfo?: PasswordLoginUserType, errorCode?: string | number) {
    super(message);
    this.epochTime = Date.now();

    if (loginInfo) {
      this.loginInfo = loginInfo;
    }

    if (errorCode) {
      this.errorCode = errorCode;
    }
  }

  toString(): string {
    try {
      return JSON.stringify({
        message: this.message,
        loginInfo: this.loginInfo,
        errorCode: this.errorCode,
        epochTime: this.epochTime,
      });
    } catch (e) {
      return 'Error was thrown but could not be serialized. ' +
        'Make sure there is no circular references parameters passed to constructor';
    }
  }

  serialize(): string {
    return this.toString();
  }
}
