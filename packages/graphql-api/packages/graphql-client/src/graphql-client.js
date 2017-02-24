// @flow

import type {
  CreateUserType,
  LoginReturnType,
} from '@accounts/common';
import {
  sendResetPasswordEmailMutation,
  sendVerificationEmailMutation,
  resetPasswordMutation,
  logoutMutation,
  verifyEmailMutation,
  createUserMutation,
  createLoginMutation,
  refreshTokenMutation,
  defaultUserFieldsFragment,
} from './graphql';

export type OptionsType = {
  graphQLClient: any,
  userFieldsFragment: string
};

export class GraphQLClient {
  constructor(options: OptionsType = {}) {
    this.options = options;

    if (!this.options.graphQLClient ||
      !this.options.graphQLClient.query ||
      !this.options.graphQLClient.mutate) {
      throw new Error('Invalid GraphQL client provided: missing \'query\' and \'mutate\' methods!');
    }
  }

  async mutate(mutation, resultField, variables) {
    return await this.options.graphQLClient.mutate({
      mutation,
      variables,
    })
      .then(({ data }) => (data[resultField]))
      .catch((e) => {
        throw new Error(e.message);
      });
  }

  async loginWithPassword(user: string, password: string): Promise<LoginReturnType> {
    const userFieldsFragment = this.options.userFieldsFragment ?
      gql`${this.options.userFieldsFragment}` :
      defaultUserFieldsFragment;
    const loginMutation = createLoginMutation(userFieldsFragment);
    console.log('Here!!!!!');
    return await this.mutate(loginMutation, 'loginWithPassword', { user, password });
  }

  async createUser(user: CreateUserType): Promise<string> {
    return await this.mutate(createUserMutation, 'createUser', { user });
  }

  async refreshTokens(accessToken: string, refreshToken: string): Promise<LoginReturnType> {
    return await this.mutate(refreshTokenMutation, 'refreshTokens', { accessToken, refreshToken });
  }

  async logout(accessToken: string): Promise<void> {
    return await this.mutate(logoutMutation, 'logout', { accessToken });
  }

  async verifyEmail(token: string): Promise<void> {
    return await this.mutate(verifyEmailMutation, 'verifyEmail', { token });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return await this.mutate(resetPasswordMutation, 'resetPassword', { token, newPassword });
  }

  async sendVerificationEmail(userId: string, email: string): Promise<void> {
    return await this.mutate(sendVerificationEmailMutation, 'sendVerificationEmail', { userId, email });
  }

  async sendResetPasswordEmail(userId: string, email: string): Promise<void> {
    return await this.mutate(sendResetPasswordEmailMutation, 'sendResetPasswordEmail', { userId, email });
  }

  options: OptionsType;
}
