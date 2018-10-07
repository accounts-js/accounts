import { TransportInterface, AccountsClient } from '@accounts/client';
import {
  CreateUser,
  LoginResult,
  AccountsOptions,
  ImpersonationResult,
  User,
} from '@accounts/types';
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
import { getAccountsOptionsQuery } from './graphql/get-accounts-options.query';

export interface IAuthenticateParams {
  [key: string]: string | object;
}

export interface IOptionsType {
  graphQLClient: any;
  userFieldsFragment?: string;
}

export default class GraphQLClient implements TransportInterface {
  public client!: AccountsClient;
  private options: IOptionsType;

  constructor(options: IOptionsType) {
    this.options = options;
  }

  /**
   * Create a user with basic user info
   *
   * @param {CreateUser} user user object
   * @returns {Promise<string>} user's ID
   * @memberof GraphQLClient
   */
  public async createUser(user: CreateUser): Promise<string> {
    return this.mutate(createUserMutation, 'register', { user });
  }

  /**
   * @inheritDoc
   */
  public async loginWithService(
    service: string,
    authenticateParams: IAuthenticateParams
  ): Promise<LoginResult> {
    return this.mutate(loginWithServiceMutation, 'authenticate', {
      serviceName: service,
      params: authenticateParams,
    });
  }

  public async getUser(): Promise<User> {
    return this.query(getUserQuery, 'getUser');
  }

  public async getAccountsOptions(): Promise<AccountsOptions> {
    return this.query(getAccountsOptionsQuery, 'getAccountsOptions');
  }

  /**
   * @inheritDoc
   */
  public async logout(): Promise<void> {
    return this.mutate(logoutMutation, 'logout');
  }

  /**
   * @inheritDoc
   */
  public async refreshTokens(accessToken: string, refreshToken: string): Promise<LoginResult> {
    return this.mutate(refreshTokensMutation, 'refreshTokens', { accessToken, refreshToken });
  }

  /**
   * @inheritDoc
   */
  public async verifyEmail(token: string): Promise<void> {
    return this.mutate(verifyEmailMutation, 'verifyEmail', { token });
  }

  /**
   * @inheritDoc
   */
  public async sendResetPasswordEmail(email: string): Promise<void> {
    return this.mutate(sendResetPasswordEmailMutation, 'sendResetPasswordEmail', { email });
  }

  /**
   * @inheritDoc
   */
  public async sendVerificationEmail(email: string): Promise<void> {
    return this.mutate(sendVerificationEmailMutation, 'sendVerificationEmail', { email });
  }

  /**
   * @inheritDoc
   */
  public async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.mutate(resetPasswordMutation, 'resetPassword', { token, newPassword });
  }

  /**
   * @inheritDoc
   */
  public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return this.mutate(changePasswordMutation, 'changePassword', { oldPassword, newPassword });
  }

  public async getTwoFactorSecret(): Promise<any> {
    return this.query(getTwoFactorSecretQuery, 'twoFactorSecret', {});
  }

  public async twoFactorSet(secret: any, code: string): Promise<void> {
    return this.mutate(twoFactorSetMutation, 'twoFactorSet', { secret, code });
  }

  public async twoFactorUnset(code: string): Promise<void> {
    return this.mutate(twoFactorUnsetMutation, 'twoFactorUnset', { code });
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
    return this.mutate(impersonateMutation, 'impersonate', {
      accessToken: token,
      username: impersonated.username,
    });
  }

  private async mutate(mutation: any, resultField: any, variables: any = {}) {
    // If we are executiong a refresh token mutation do not call refress session again
    // otherwise it will end up in an infinite loop
    const tokens =
      mutation === refreshTokensMutation
        ? await this.client.getTokens()
        : await this.client.refreshSession();

    try {
      const { data } = await this.options.graphQLClient.mutate({
        mutation,
        variables,
        context: {
          headers: {
            'accounts-access-token': tokens ? tokens.accessToken : '',
          },
        },
      });
      return data[resultField];
    } catch (e) {
      throw new Error(e.message);
    }
  }

  private async query(query: any, resultField: any, variables: any = {}) {
    const tokens = (await this.client.refreshSession()) || { accessToken: '' };

    try {
      const { data } = await this.options.graphQLClient.query({
        query,
        variables,
        context: {
          headers: {
            'accounts-access-token': tokens.accessToken,
          },
        },
      });
      return data[resultField];
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
