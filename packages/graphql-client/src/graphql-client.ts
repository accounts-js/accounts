import { AccountsClient, TransportInterface } from '@accounts/client';
import {
  CreateUser,
  ImpersonationResult,
  LoginResult,
  User,
  CreateUserResult,
  Authenticator,
} from '@accounts/types';
import { print } from 'graphql/language';
import gql from 'graphql-tag';
import { addEmailMutation } from './graphql/add-email.mutation';
import { authenticateWithServiceMutation } from './graphql/authenticate-with-service.mutation';
import { changePasswordMutation } from './graphql/change-password.mutation';
import { createUserMutation } from './graphql/create-user.mutation';
import { getTwoFactorSecretQuery } from './graphql/get-two-factor-secret.query';
import { getUserQuery } from './graphql/get-user.query';
import { impersonateMutation } from './graphql/impersonate.mutation';
import { loginWithServiceMutation } from './graphql/login-with-service.mutation';
import { logoutMutation } from './graphql/logout.mutation';
import { refreshTokensMutation } from './graphql/refresh-tokens.mutation';
import { resetPasswordMutation } from './graphql/reset-password.mutation';
import { sendResetPasswordEmailMutation } from './graphql/send-reset-password-email.mutation';
import { sendVerificationEmailMutation } from './graphql/send-verification-email.mutation';
import { twoFactorSetMutation } from './graphql/two-factor-set.mutation';
import { twoFactorUnsetMutation } from './graphql/two-factor-unset.mutation';
import { verifyEmailMutation } from './graphql/verify-email.mutation';
import { authenticatorsQuery } from './graphql/accounts-mfa/authenticators.query';
import { authenticatorsByMfaTokenQuery } from './graphql/accounts-mfa/authenticatorsByMfaToken.query';
import { challengeMutation } from './graphql/accounts-mfa/challenge.mutation';
import { associateMutation } from './graphql/accounts-mfa/associate.mutation';
import { associateByMfaTokenMutation } from './graphql/accounts-mfa/associateByMfaToken.mutation';
import { GraphQLErrorList } from './GraphQLErrorList';

export interface AuthenticateParams {
  [key: string]: string | object;
}

export interface OptionsType {
  graphQLClient: any;
  userFieldsFragment?: any;
  challengeFieldsFragment?: string;
  associateFieldsFragment?: string;
}

export default class GraphQLClient implements TransportInterface {
  public client!: AccountsClient;
  private options: OptionsType;

  constructor(options: OptionsType) {
    this.options = options;
    this.options.userFieldsFragment =
      this.options.userFieldsFragment ||
      gql`
        fragment userFields on User {
          id
          emails {
            address
            verified
          }
          username
        }
      `;
  }

  /**
   * Create a user with basic user info
   *
   * @param {CreateUser} user user object
   * @returns {Promise<CreateUserResult>} contains user's ID and LoginResult object if autologin is enabled
   * @memberof GraphQLClient
   */
  public async createUser(user: CreateUser): Promise<CreateUserResult> {
    return this.mutate(createUserMutation(this.options.userFieldsFragment), 'createUser', { user });
  }

  /**
   * @inheritDoc
   */
  public async authenticateWithService(
    service: string,
    authenticateParams: { [key: string]: string | object }
  ): Promise<boolean> {
    return this.mutate(authenticateWithServiceMutation, 'verifyAuthentication', {
      serviceName: service,
      params: authenticateParams,
    });
  }

  /**
   * @inheritDoc
   */
  public async loginWithService(
    service: string,
    authenticateParams: AuthenticateParams
  ): Promise<LoginResult> {
    return this.mutate(loginWithServiceMutation(this.options.userFieldsFragment), 'authenticate', {
      serviceName: service,
      params: authenticateParams,
    });
  }

  public async getUser(): Promise<User> {
    return this.query(getUserQuery(this.options.userFieldsFragment), 'getUser');
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
  public async resetPassword(token: string, newPassword: string): Promise<LoginResult | null> {
    return this.mutate(resetPasswordMutation, 'resetPassword', { token, newPassword });
  }

  /**
   * @inheritDoc
   */
  public async addEmail(newEmail: string): Promise<void> {
    return this.mutate(addEmailMutation, 'addEmail', { newEmail });
  }

  /**
   * @inheritDoc
   */
  public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return this.mutate(changePasswordMutation, 'changePassword', { oldPassword, newPassword });
  }

  /**
   * @inheritDoc
   */
  public async getTwoFactorSecret(): Promise<any> {
    return this.query(getTwoFactorSecretQuery, 'twoFactorSecret', {});
  }

  /**
   * @inheritDoc
   */
  public async twoFactorSet(secret: any, code: string): Promise<void> {
    return this.mutate(twoFactorSetMutation, 'twoFactorSet', { secret, code });
  }

  /**
   * @inheritDoc
   */
  public async twoFactorUnset(code: string): Promise<void> {
    return this.mutate(twoFactorUnsetMutation, 'twoFactorUnset', { code });
  }

  /**
   * @inheritDoc
   */
  public async impersonate(
    token: string,
    impersonated: {
      username?: string;
      /* These aren't implemented in graphql-api, comment them out for now to avoid confusion */
      // userId?: string;
      // email?: string;
    }
  ): Promise<ImpersonationResult> {
    return this.mutate(impersonateMutation(this.options.userFieldsFragment), 'impersonate', {
      accessToken: token,
      username: impersonated.username,
    });
  }

  /**
   * @inheritDoc
   */
  public async mfaAssociate(type: string, params?: any): Promise<void> {
    return this.mutate(associateMutation(this.options.associateFieldsFragment), 'associate', {
      type,
      params,
    });
  }

  /**
   * @inheritDoc
   */
  public async mfaAssociateByMfaToken(mfaToken: string, type: string, params?: any): Promise<any> {
    return this.mutate(
      associateByMfaTokenMutation(this.options.associateFieldsFragment),
      'associateByMfaToken',
      {
        mfaToken,
        type,
        params,
      }
    );
  }

  /**
   * @inheritDoc
   */
  public async authenticators(): Promise<Authenticator[]> {
    return this.query(authenticatorsQuery, 'authenticators');
  }

  /**
   * @inheritDoc
   */
  public async authenticatorsByMfaToken(mfaToken?: string): Promise<Authenticator[]> {
    return this.query(authenticatorsByMfaTokenQuery, 'authenticatorsByMfaToken', { mfaToken });
  }

  /**
   * @inheritDoc
   */
  public async mfaChallenge(mfaToken: string, authenticatorId: string): Promise<any> {
    return this.mutate(challengeMutation(this.options.challengeFieldsFragment), 'challenge', {
      mfaToken,
      authenticatorId,
    });
  }

  private async mutate(mutation: any, resultField: any, variables: any = {}) {
    // If we are executing a refresh token mutation do not call refresh session again
    // otherwise it will end up in an infinite loop
    const tokens =
      mutation === refreshTokensMutation
        ? await this.client.getTokens()
        : await this.client.refreshSession();

    const headers: { Authorization?: string } = {};
    if (tokens) {
      headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    const { data, errors } = await this.options.graphQLClient.mutate({
      mutation,
      variables,
      context: {
        headers,
      },
    });

    if (errors) {
      throw new GraphQLErrorList(errors, `in mutation: \r\n ${print(mutation)}`);
    }

    return data[resultField];
  }

  private async query(query: any, resultField: any, variables: any = {}) {
    const tokens = await this.client.refreshSession();

    const headers: { Authorization?: string } = {};
    if (tokens) {
      headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    const { data, errors } = await this.options.graphQLClient.query({
      query,
      variables,
      fetchPolicy: 'network-only',
      context: {
        headers,
      },
    });

    if (errors) {
      throw new GraphQLErrorList(errors, `in query: \r\n ${print(query)}`);
    }

    return data[resultField];
  }
}
