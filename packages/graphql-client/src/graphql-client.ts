import { TransportInterface, AccountsClient } from '@accounts/client';
import { CreateUser, LoginResult, ImpersonationResult, User } from '@accounts/types';
import { createUserMutation } from './graphql/create-user.mutation';
import { loginWithServiceMutation } from './graphql/login-with-service.mutation';
import { logoutMutation } from './graphql/logout.mutation';
import { refreshTokensMutation } from './graphql/refresh-tokens.mutation';
import { verifyEmailMutation } from './graphql/verify-email.mutation';
import { sendResetPasswordEmailMutation } from './graphql/send-reset-password-email.mutation';
import { sendVerificationEmailMutation } from './graphql/send-verification-email.mutation';
import { resetPasswordMutation } from './graphql/reset-password.mutation';
import { changePasswordMutation } from './graphql/change-password.mutation';
import { twoFactorSetMutation } from './graphql/two-factor-set.mutation';
import { getTwoFactorSecretQuery } from './graphql/get-two-factor-secret.query';
import { twoFactorUnsetMutation } from './graphql/two-factor-unset.mutation';
import { impersonateMutation } from './graphql/impersonate.mutation';
import { getUserQuery } from './graphql/get-user.query';

export interface AuthenticateParams {
  [key: string]: string | object;
}

export interface OptionsType {
  url: string;
  /**
   * Additional headers sent with the fetch request to the server
   */
  headers?: { [key: string]: any };
  userFieldsFragment?: string;
}

const defaultOptions = {
  headers: {},
};

export default class GraphQLClient implements TransportInterface {
  public client!: AccountsClient;
  private options: OptionsType;

  constructor(options: OptionsType) {
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Create a user with basic user info
   *
   * @param {CreateUser} user user object
   * @returns {Promise<string>} user's ID
   * @memberof GraphQLClient
   */
  public async createUser(user: CreateUser): Promise<string> {
    return this.request(createUserMutation, 'register', { user });
  }

  /**
   * @inheritDoc
   */
  public async loginWithService(
    service: string,
    authenticateParams: AuthenticateParams
  ): Promise<LoginResult> {
    return this.request(loginWithServiceMutation, 'authenticate', {
      serviceName: service,
      params: authenticateParams,
    });
  }

  public async getUser(accessToken: string): Promise<User> {
    return this.request(getUserQuery, 'getUser', { accessToken });
  }

  /**
   * @inheritDoc
   */
  public async logout(accessToken: string): Promise<void> {
    return this.request(logoutMutation, 'logout', { accessToken });
  }

  /**
   * @inheritDoc
   */
  public async refreshTokens(accessToken: string, refreshToken: string): Promise<LoginResult> {
    return this.request(refreshTokensMutation, 'refreshTokens', { accessToken, refreshToken });
  }

  /**
   * @inheritDoc
   */
  public async verifyEmail(token: string): Promise<void> {
    return this.request(verifyEmailMutation, 'verifyEmail', { token });
  }

  /**
   * @inheritDoc
   */
  public async sendResetPasswordEmail(email: string): Promise<void> {
    return this.request(sendResetPasswordEmailMutation, 'sendResetPasswordEmail', { email });
  }

  /**
   * @inheritDoc
   */
  public async sendVerificationEmail(email: string): Promise<void> {
    return this.request(sendVerificationEmailMutation, 'sendVerificationEmail', { email });
  }

  /**
   * @inheritDoc
   */
  public async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.request(resetPasswordMutation, 'resetPassword', { token, newPassword });
  }

  /**
   * @inheritDoc
   */
  public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return this.request(changePasswordMutation, 'changePassword', { oldPassword, newPassword });
  }

  public async getTwoFactorSecret(): Promise<any> {
    return this.request(getTwoFactorSecretQuery, 'twoFactorSecret', {});
  }

  public async twoFactorSet(secret: any, code: string): Promise<void> {
    return this.request(twoFactorSetMutation, 'twoFactorSet', { secret, code });
  }

  public async twoFactorUnset(code: string): Promise<void> {
    return this.request(twoFactorUnsetMutation, 'twoFactorUnset', { code });
  }

  /**
   * @inheritDoc
   */
  public async impersonate(
    token: string,
    impersonated: {
      userId?: string;
      username?: string;
      email?: string;
    }
  ): Promise<ImpersonationResult> {
    return this.request(impersonateMutation, 'impersonate', {
      accessToken: token,
      username: impersonated.username,
    });
  }

  private async request(query: string, resultField: string, variables?: { [key: string]: any }) {
    // If we are executiong a refresh token mutation do not call refress session again
    // otherwise it will end up in an infinite loop
    const tokens =
      query === refreshTokensMutation
        ? await this.client.getTokens()
        : await this.client.refreshSession();

    const response = await fetch(this.options.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accounts-access-token': tokens ? tokens.accessToken : '',
        ...this.options.headers,
      },
      body: JSON.stringify({
        query,
        variables: variables ? variables : undefined,
      }),
    });

    const contentType = response.headers.get('Content-Type');
    const result =
      contentType && contentType.startsWith('application/json')
        ? await response.json()
        : await response.text();
    if (response.ok && !result.errors && result.data) {
      return result.data[resultField];
    } else {
      throw new Error(result);
    }
  }
}
