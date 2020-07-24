import { AccountsClient, TransportInterface } from '@accounts/client';
import {
  CreateUser,
  ImpersonationResult,
  LoginResult,
  User,
  CreateUserResult,
} from '@accounts/types';
import { print } from 'graphql/language';
import gql from 'graphql-tag';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  CreateUserDocument,
  AddEmailDocument,
  AuthenticateWithServiceDocument,
  GetTwoFactorSecretDocument,
  ChangePasswordDocument,
  LogoutDocument,
  VerifyEmailDocument,
  SendResetPasswordEmailDocument,
  SendVerificationEmailDocument,
  ResetPasswordDocument,
  TwoFactorSetDocument,
  TwoFactorUnsetDocument,
  RefreshTokensDocument,
  GetUserDocument,
  ImpersonateDocument,
  AuthenticateDocument,
} from './graphql-operations';
import { GraphQLErrorList } from './GraphQLErrorList';

export interface AuthenticateParams {
  [key: string]: string | object;
}

export interface OptionsType {
  graphQLClient: any;
  userFieldsFragment?: any;
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
    // TODO allow this.options.userFieldsFragment customisation of the created user
    return this.mutate(CreateUserDocument, 'createUser', { user });
  }

  /**
   * @inheritDoc
   */
  public async authenticateWithService(
    service: string,
    authenticateParams: { [key: string]: string | object }
  ): Promise<boolean> {
    return this.mutate(AuthenticateWithServiceDocument, 'verifyAuthentication', {
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
    // TODO allow this.options.userFieldsFragment customisation
    return this.mutate(AuthenticateDocument, 'authenticate', {
      serviceName: service,
      params: authenticateParams,
    });
  }

  public async getUser(): Promise<User> {
    // TODO allow this.options.userFieldsFragment customisation of the created user
    return this.query(GetUserDocument, 'getUser');
  }

  /**
   * @inheritDoc
   */
  public async logout(): Promise<void> {
    return this.mutate(LogoutDocument, 'logout');
  }

  /**
   * @inheritDoc
   */
  public async refreshTokens(accessToken: string, refreshToken: string): Promise<LoginResult> {
    return this.mutate(RefreshTokensDocument, 'refreshTokens', { accessToken, refreshToken });
  }

  /**
   * @inheritDoc
   */
  public async verifyEmail(token: string): Promise<void> {
    return this.mutate(VerifyEmailDocument, 'verifyEmail', { token });
  }

  /**
   * @inheritDoc
   */
  public async sendResetPasswordEmail(email: string): Promise<void> {
    return this.mutate(SendResetPasswordEmailDocument, 'sendResetPasswordEmail', { email });
  }

  /**
   * @inheritDoc
   */
  public async sendVerificationEmail(email: string): Promise<void> {
    return this.mutate(SendVerificationEmailDocument, 'sendVerificationEmail', { email });
  }

  /**
   * @inheritDoc
   */
  public async resetPassword(token: string, newPassword: string): Promise<LoginResult | null> {
    return this.mutate(ResetPasswordDocument, 'resetPassword', { token, newPassword });
  }

  /**
   * @inheritDoc
   */
  public async addEmail(newEmail: string): Promise<void> {
    return this.mutate(AddEmailDocument, 'addEmail', { newEmail });
  }

  /**
   * @inheritDoc
   */
  public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return this.mutate(ChangePasswordDocument, 'changePassword', { oldPassword, newPassword });
  }

  /**
   * @inheritDoc
   */
  public async getTwoFactorSecret(): Promise<any> {
    return this.query(GetTwoFactorSecretDocument, 'twoFactorSecret', {});
  }

  /**
   * @inheritDoc
   */
  public async twoFactorSet(secret: any, code: string): Promise<void> {
    return this.mutate(TwoFactorSetDocument, 'twoFactorSet', { secret, code });
  }

  /**
   * @inheritDoc
   */
  public async twoFactorUnset(code: string): Promise<void> {
    return this.mutate(TwoFactorUnsetDocument, 'twoFactorUnset', { code });
  }

  /**
   * @inheritDoc
   */
  public async impersonate(
    token: string,
    impersonated: {
      username?: string;
      userId?: string;
      email?: string;
    }
  ): Promise<ImpersonationResult> {
    // TODO allow this.options.userFieldsFragment customisation
    return this.mutate(ImpersonateDocument, 'impersonate', {
      accessToken: token,
      impersonated: {
        userId: impersonated.userId,
        username: impersonated.username,
        email: impersonated.email,
      },
    });
  }

  private async mutate<TData = any, TVariables = Record<string, any>>(
    mutation: TypedDocumentNode<TData, TVariables>,
    resultField: any,
    variables?: TVariables
  ): Promise<any> {
    // If we are executing a refresh token mutation do not call refresh session again
    // otherwise it will end up in an infinite loop
    const tokens =
      mutation === RefreshTokensDocument
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

  private async query<TData = any, TVariables = Record<string, any>>(
    query: TypedDocumentNode<TData, TVariables>,
    resultField: any,
    variables?: TVariables
  ): Promise<any> {
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
