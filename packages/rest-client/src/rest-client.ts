import { forIn, isPlainObject } from 'lodash';
import { TransportInterface, AccountsClient } from '@accounts/client';
import {
  User,
  LoginResult,
  CreateUser,
  ImpersonationResult,
  LoginUserIdentity,
} from '@accounts/types';

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
        const { message } = await res.json();
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
      ...{
        'accounts-access-token': tokens ? tokens.accessToken : '',
      },
    });
  }

  public loginWithService(
    provider: string,
    data: any,
    customHeaders?: object
  ): Promise<LoginResult> {
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
    impersonated: LoginUserIdentity,
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

  public async createUser(user: CreateUser, customHeaders?: object): Promise<string> {
    const args = {
      method: 'POST',
      body: JSON.stringify({ user }),
    };
    return this.fetch('password/register', args, customHeaders);
  }

  public resetPassword(token: string, newPassword: string, customHeaders?: object): Promise<void> {
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

  public getTwoFactorSecret(customHeaders?: object): Promise<any> {
    const args = {
      method: 'POST',
    };
    return this.fetch('password/twoFactorSecret', args, customHeaders);
  }

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

  public twoFactorUnset(code: string, customHeaders?: object): Promise<void> {
    const args = {
      method: 'POST',
      body: JSON.stringify({
        code,
      }),
    };
    return this.authFetch('password/twoFactorUnset', args, customHeaders);
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
