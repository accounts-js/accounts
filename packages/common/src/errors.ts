import { LoginUserIdentityType } from './types';

export class AccountsError extends Error {
  public loginInfo: LoginUserIdentityType;
  public errorCode: string | number;
  public epochTime: number;

  constructor(message: string, loginInfo?: LoginUserIdentityType, errorCode?: string | number) {
    super(message);
    Object.setPrototypeOf(this, AccountsError.prototype);

    this.epochTime = Date.now();

    if (loginInfo) {
      this.loginInfo = loginInfo;
    }

    if (errorCode) {
      this.errorCode = errorCode;
    }
  }

  public toString(): string {
    try {
      return JSON.stringify({
        message: this.message,
        loginInfo: this.loginInfo,
        errorCode: this.errorCode,
        epochTime: this.epochTime,
      });
    } catch (e) {
      return (
        'Error was thrown but could not be serialized. ' +
        'Make sure there is no circular references parameters passed to constructor'
      );
    }
  }

  public serialize(): string {
    return this.toString();
  }
}
