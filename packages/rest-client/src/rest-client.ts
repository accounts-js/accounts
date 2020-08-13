import { forIn, isPlainObject } from 'lodash';
import { TransportInterface, AccountsClient } from '@accounts/client';
import {
  User,
  LoginResult,
  CreateUser,
  ImpersonationUserIdentity,
  ImpersonationResult,
  CreateUserResult,
  AuthenticationResult,
} from '@accounts/types';
import { AccountsJsError } from './accounts-error';

export interface OptionsType {
  apiHost: string;
  rootPath: string;
}

const headers: { [key: string]: string } = {
  'Content-Type': 'application/json',
};

export class RestClient implements TransportInterface {
  public client!: AccountsClient;
  private options: OptionsType;

  constructor(options: OptionsType) {
    this.options = options;
  }

  public async fetch(route: string, args: object, customHeaders: object = {}): Promise<any> {
    const fetchOptions = {
      headers: this._loadHeadersObject(customHeaders),
      ...args,
    };
    const res = await fetch(
      `${this.options.apiHost}${this.options.rootPath}/${route}`,
      fetchOptions
    );

    if (res) {
      if (res.status >= 400 && res.status < 600) {
        const { message, code } = await res.json();
        // If code is present it means the server returned an `AccountsJsError` error
        // so we can safely do the same on the client
        if (code) {
          throw new AccountsJsError(message, code);
        }
        throw new Error(message);
      }
      return res.json();
    } else {
      throw new Error('Server did not return a response');
    }
  }

  public async authFetch(route: string, args: object, customHeaders: object = {}): Promise<any> {
    const tokens = await this.client.refreshSession();
    return this.fetch(route, args, {
      ...customHeaders,
      Authorization: tokens ? 'Bearer ' + tokens.accessToken : '',
    });
  }

  public authenticateWithService(
    provider: string,
    data: any,
    customHeaders?: object
  ): Promise<boolean> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        ...data,
      }),
    };
    return this.fetch(`${provider}/verifyAuthentication`, args, customHeaders);
  }

  public loginWithService(
    provider: string,
    data: any,
    customHeaders?: object
  ): Promise<AuthenticationResult> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        ...data,
      }),
    };
    return this.fetch(`${provider}/authenticate`, args, customHeaders);
  }

  public impersonate(
    accessToken: string,
    impersonated: ImpersonationUserIdentity,
    customHeaders?: object
  ): Promise<ImpersonationResult> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        accessToken,
        impersonated,
      }),
    };
    return this.fetch('impersonate', args, customHeaders);
  }

  public refreshTokens(
    accessToken: string,
    refreshToken: string,
    customHeaders?: object
  ): Promise<LoginResult> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    };
    return this.fetch('refreshTokens', args, customHeaders);
  }

  public logout(customHeaders?: object): Promise<void> {
    const args = {
      method: 'POST',
      body: JSON.stringify({}),
    };
    return this.authFetch('logout', args, customHeaders);
  }

  public async getUser(customHeaders?: object): Promise<User> {
    const args = {
      method: 'POST',
      body: JSON.stringify({}),
    };
    return this.authFetch('user', args, customHeaders);
  }

  public async createUser(user: CreateUser, customHeaders?: object): Promise<CreateUserResult> {
    const args = {
      method: 'POST',
      body: JSON.stringify({ user }),
    };
    return this.fetch('password/register', args, customHeaders);
  }

  public resetPassword(
    token: string,
    newPassword: string,
    customHeaders?: object
  ): Promise<LoginResult | null> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        token,
        newPassword,
      }),
    };
    return this.fetch('password/resetPassword', args, customHeaders);
  }

  public verifyEmail(token: string, customHeaders?: object): Promise<void> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
    };
    return this.fetch('password/verifyEmail', args, customHeaders);
  }

  public sendVerificationEmail(email: string, customHeaders?: object): Promise<void> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    };
    return this.fetch('password/sendVerificationEmail', args, customHeaders);
  }

  public sendResetPasswordEmail(email: string, customHeaders?: object): Promise<void> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    };
    return this.fetch('password/sendResetPasswordEmail', args, customHeaders);
  }

  public addEmail(newEmail: string, customHeaders?: object): Promise<void> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        newEmail,
      }),
    };
    return this.authFetch('password/addEmail', args, customHeaders);
  }

  public changePassword(
    oldPassword: string,
    newPassword: string,
    customHeaders?: object
  ): Promise<void> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    };
    return this.authFetch('password/changePassword', args, customHeaders);
  }

  /**
   * @deprecated
   */
  public getTwoFactorSecret(customHeaders?: object): Promise<any> {
    const args = {
      method: 'POST',
    };
    return this.fetch('password/twoFactorSecret', args, customHeaders);
  }

  /**
   * @deprecated
   */
  public twoFactorSet(secret: any, code: string, customHeaders?: object): Promise<void> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        secret,
        code,
      }),
    };
    return this.authFetch('password/twoFactorSet', args, customHeaders);
  }

  /**
   * @deprecated
   */
  public twoFactorUnset(code: string, customHeaders?: object): Promise<void> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        code,
      }),
    };
    return this.authFetch('password/twoFactorUnset', args, customHeaders);
  }

  public async mfaChallenge(mfaToken: string, authenticatorId: string, customHeaders?: object) {
    const args = {
      method: 'POST',
      body: JSON.stringify({ mfaToken, authenticatorId }),
    };
    return this.fetch(`mfa/challenge`, args, customHeaders);
  }

  public async mfaAssociate(type: string, params?: any, customHeaders?: object) {
    const args = {
      method: 'POST',
      body: JSON.stringify({ type, params }),
    };
    return this.authFetch(`mfa/associate`, args, customHeaders);
  }

  public async mfaAssociateByMfaToken(
    mfaToken: string,
    type: string,
    params?: any,
    customHeaders?: object
  ) {
    const args = {
      method: 'POST',
      body: JSON.stringify({ mfaToken, type, params }),
    };
    return this.fetch(`mfa/associateByMfaToken`, args, customHeaders);
  }

  public async authenticators(customHeaders?: object) {
    const args = {
      method: 'GET',
    };
    let route = `mfa/authenticators`;
    return this.authFetch(route, args, customHeaders);
  }

  public async authenticatorsByMfaToken(mfaToken: string, customHeaders?: object) {
    const args = {
      method: 'GET',
    };
    return this.fetch(`mfa/authenticators?mfaToken=${mfaToken}`, args, customHeaders);
  }

  private _loadHeadersObject(plainHeaders: object): { [key: string]: string } {
    if (isPlainObject(plainHeaders)) {
      const customHeaders = headers;
      forIn(plainHeaders, (v: string, k: string) => {
        customHeaders[k] = v;
      });

      return customHeaders;
    }

    return headers;
  }
}

export default RestClient;
