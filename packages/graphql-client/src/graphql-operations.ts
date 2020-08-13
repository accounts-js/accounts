/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AssociateParamsInput = {
  _?: Maybe<Scalars['String']>;
};

export type AssociationResult = OtpAssociationResult;

export type AuthenticateParamsInput = {
  access_token?: Maybe<Scalars['String']>;
  access_token_secret?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  user?: Maybe<UserInput>;
  code?: Maybe<Scalars['String']>;
};

export type AuthenticationResult = LoginResult | MultiFactorResult;

export type Authenticator = {
  __typename?: 'Authenticator';
  id?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  activatedAt?: Maybe<Scalars['String']>;
};

export type ChallengeResult = DefaultChallengeResult;

export type CreateUserInput = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type CreateUserResult = {
  __typename?: 'CreateUserResult';
  userId?: Maybe<Scalars['ID']>;
  loginResult?: Maybe<LoginResult>;
};

export type DefaultChallengeResult = {
  __typename?: 'DefaultChallengeResult';
  mfaToken?: Maybe<Scalars['String']>;
  authenticatorId?: Maybe<Scalars['String']>;
};

export type EmailRecord = {
  __typename?: 'EmailRecord';
  address?: Maybe<Scalars['String']>;
  verified?: Maybe<Scalars['Boolean']>;
};

export type ImpersonateReturn = {
  __typename?: 'ImpersonateReturn';
  authorized?: Maybe<Scalars['Boolean']>;
  tokens?: Maybe<Tokens>;
  user?: Maybe<User>;
};

export type ImpersonationUserIdentityInput = {
  userId?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  sessionId?: Maybe<Scalars['String']>;
  tokens?: Maybe<Tokens>;
  user?: Maybe<User>;
};

export type MultiFactorResult = {
  __typename?: 'MultiFactorResult';
  mfaToken: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser?: Maybe<CreateUserResult>;
  verifyEmail?: Maybe<Scalars['Boolean']>;
  resetPassword?: Maybe<LoginResult>;
  sendVerificationEmail?: Maybe<Scalars['Boolean']>;
  sendResetPasswordEmail?: Maybe<Scalars['Boolean']>;
  addEmail?: Maybe<Scalars['Boolean']>;
  changePassword?: Maybe<Scalars['Boolean']>;
  twoFactorSet?: Maybe<Scalars['Boolean']>;
  twoFactorUnset?: Maybe<Scalars['Boolean']>;
  challenge?: Maybe<ChallengeResult>;
  associate?: Maybe<AssociationResult>;
  associateByMfaToken?: Maybe<AssociationResult>;
  impersonate?: Maybe<ImpersonateReturn>;
  refreshTokens?: Maybe<LoginResult>;
  logout?: Maybe<Scalars['Boolean']>;
  authenticate?: Maybe<AuthenticationResult>;
  verifyAuthentication?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateUserArgs = {
  user: CreateUserInput;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationSendVerificationEmailArgs = {
  email: Scalars['String'];
};


export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationAddEmailArgs = {
  newEmail: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationTwoFactorSetArgs = {
  secret: TwoFactorSecretKeyInput;
  code: Scalars['String'];
};


export type MutationTwoFactorUnsetArgs = {
  code: Scalars['String'];
};


export type MutationChallengeArgs = {
  mfaToken: Scalars['String'];
  authenticatorId: Scalars['String'];
};


export type MutationAssociateArgs = {
  type: Scalars['String'];
  params?: Maybe<AssociateParamsInput>;
};


export type MutationAssociateByMfaTokenArgs = {
  mfaToken: Scalars['String'];
  type: Scalars['String'];
  params?: Maybe<AssociateParamsInput>;
};


export type MutationImpersonateArgs = {
  accessToken: Scalars['String'];
  impersonated: ImpersonationUserIdentityInput;
};


export type MutationRefreshTokensArgs = {
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};


export type MutationAuthenticateArgs = {
  serviceName: Scalars['String'];
  params: AuthenticateParamsInput;
};


export type MutationVerifyAuthenticationArgs = {
  serviceName: Scalars['String'];
  params: AuthenticateParamsInput;
};

export type OtpAssociationResult = {
  __typename?: 'OTPAssociationResult';
  mfaToken?: Maybe<Scalars['String']>;
  authenticatorId?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  twoFactorSecret?: Maybe<TwoFactorSecretKey>;
  authenticators?: Maybe<Array<Maybe<Authenticator>>>;
  authenticatorsByMfaToken?: Maybe<Array<Maybe<Authenticator>>>;
  getUser?: Maybe<User>;
};


export type QueryAuthenticatorsByMfaTokenArgs = {
  mfaToken: Scalars['String'];
};

export type Tokens = {
  __typename?: 'Tokens';
  refreshToken?: Maybe<Scalars['String']>;
  accessToken?: Maybe<Scalars['String']>;
};

export type TwoFactorSecretKey = {
  __typename?: 'TwoFactorSecretKey';
  ascii?: Maybe<Scalars['String']>;
  base32?: Maybe<Scalars['String']>;
  hex?: Maybe<Scalars['String']>;
  qr_code_ascii?: Maybe<Scalars['String']>;
  qr_code_hex?: Maybe<Scalars['String']>;
  qr_code_base32?: Maybe<Scalars['String']>;
  google_auth_qr?: Maybe<Scalars['String']>;
  otpauth_url?: Maybe<Scalars['String']>;
};

export type TwoFactorSecretKeyInput = {
  ascii?: Maybe<Scalars['String']>;
  base32?: Maybe<Scalars['String']>;
  hex?: Maybe<Scalars['String']>;
  qr_code_ascii?: Maybe<Scalars['String']>;
  qr_code_hex?: Maybe<Scalars['String']>;
  qr_code_base32?: Maybe<Scalars['String']>;
  google_auth_qr?: Maybe<Scalars['String']>;
  otpauth_url?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  emails?: Maybe<Array<EmailRecord>>;
  username?: Maybe<Scalars['String']>;
};

export type UserInput = {
  id?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type AssociationResultFragment = (
  { __typename?: 'OTPAssociationResult' }
  & Pick<OtpAssociationResult, 'mfaToken' | 'authenticatorId'>
);

export type AssociateMutationVariables = Exact<{
  type: Scalars['String'];
  params?: Maybe<AssociateParamsInput>;
}>;


export type AssociateMutation = (
  { __typename?: 'Mutation' }
  & { associate?: Maybe<(
    { __typename?: 'OTPAssociationResult' }
    & AssociationResultFragment
  )> }
);

export type AssociateByMfaTokenMutationVariables = Exact<{
  mfaToken: Scalars['String'];
  type: Scalars['String'];
  params?: Maybe<AssociateParamsInput>;
}>;


export type AssociateByMfaTokenMutation = (
  { __typename?: 'Mutation' }
  & { associateByMfaToken?: Maybe<(
    { __typename?: 'OTPAssociationResult' }
    & AssociationResultFragment
  )> }
);

export type ChallengeMutationVariables = Exact<{
  mfaToken: Scalars['String'];
  authenticatorId: Scalars['String'];
}>;


export type ChallengeMutation = (
  { __typename?: 'Mutation' }
  & { challenge?: Maybe<(
    { __typename?: 'DefaultChallengeResult' }
    & Pick<DefaultChallengeResult, 'mfaToken' | 'authenticatorId'>
  )> }
);

export type AuthenticatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthenticatorsQuery = (
  { __typename?: 'Query' }
  & { authenticators?: Maybe<Array<Maybe<(
    { __typename?: 'Authenticator' }
    & Pick<Authenticator, 'id' | 'type' | 'active' | 'activatedAt'>
  )>>> }
);

export type AuthenticatorsByMfaTokenQueryVariables = Exact<{
  mfaToken: Scalars['String'];
}>;


export type AuthenticatorsByMfaTokenQuery = (
  { __typename?: 'Query' }
  & { authenticatorsByMfaToken?: Maybe<Array<Maybe<(
    { __typename?: 'Authenticator' }
    & Pick<Authenticator, 'id' | 'type' | 'active' | 'activatedAt'>
  )>>> }
);

export type UserFieldsFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
  & { emails?: Maybe<Array<(
    { __typename?: 'EmailRecord' }
    & Pick<EmailRecord, 'address' | 'verified'>
  )>> }
);

export type AddEmailMutationVariables = Exact<{
  newEmail: Scalars['String'];
}>;


export type AddEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addEmail'>
);

export type AuthenticateWithServiceMutationVariables = Exact<{
  serviceName: Scalars['String'];
  params: AuthenticateParamsInput;
}>;


export type AuthenticateWithServiceMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verifyAuthentication'>
);

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changePassword'>
);

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser?: Maybe<(
    { __typename?: 'CreateUserResult' }
    & Pick<CreateUserResult, 'userId'>
    & { loginResult?: Maybe<(
      { __typename?: 'LoginResult' }
      & Pick<LoginResult, 'sessionId'>
      & { tokens?: Maybe<(
        { __typename?: 'Tokens' }
        & Pick<Tokens, 'refreshToken' | 'accessToken'>
      )>, user?: Maybe<(
        { __typename?: 'User' }
        & UserFieldsFragment
      )> }
    )> }
  )> }
);

export type ImpersonateMutationVariables = Exact<{
  accessToken: Scalars['String'];
  impersonated: ImpersonationUserIdentityInput;
}>;


export type ImpersonateMutation = (
  { __typename?: 'Mutation' }
  & { impersonate?: Maybe<(
    { __typename?: 'ImpersonateReturn' }
    & Pick<ImpersonateReturn, 'authorized'>
    & { tokens?: Maybe<(
      { __typename?: 'Tokens' }
      & Pick<Tokens, 'refreshToken' | 'accessToken'>
    )>, user?: Maybe<(
      { __typename?: 'User' }
      & UserFieldsFragment
    )> }
  )> }
);

export type AuthenticateMutationVariables = Exact<{
  serviceName: Scalars['String'];
  params: AuthenticateParamsInput;
}>;


export type AuthenticateMutation = (
  { __typename?: 'Mutation' }
  & { authenticate?: Maybe<(
    { __typename?: 'LoginResult' }
    & Pick<LoginResult, 'sessionId'>
    & { tokens?: Maybe<(
      { __typename?: 'Tokens' }
      & Pick<Tokens, 'refreshToken' | 'accessToken'>
    )>, user?: Maybe<(
      { __typename?: 'User' }
      & UserFieldsFragment
    )> }
  ) | { __typename?: 'MultiFactorResult' }> }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RefreshTokensMutationVariables = Exact<{
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
}>;


export type RefreshTokensMutation = (
  { __typename?: 'Mutation' }
  & { refreshTokens?: Maybe<(
    { __typename?: 'LoginResult' }
    & Pick<LoginResult, 'sessionId'>
    & { tokens?: Maybe<(
      { __typename?: 'Tokens' }
      & Pick<Tokens, 'refreshToken' | 'accessToken'>
    )> }
  )> }
);

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword?: Maybe<(
    { __typename?: 'LoginResult' }
    & Pick<LoginResult, 'sessionId'>
    & { tokens?: Maybe<(
      { __typename?: 'Tokens' }
      & Pick<Tokens, 'refreshToken' | 'accessToken'>
    )> }
  )> }
);

export type SendResetPasswordEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendResetPasswordEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendResetPasswordEmail'>
);

export type SendVerificationEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendVerificationEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendVerificationEmail'>
);

export type TwoFactorSetMutationVariables = Exact<{
  secret: TwoFactorSecretKeyInput;
  code: Scalars['String'];
}>;


export type TwoFactorSetMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'twoFactorSet'>
);

export type TwoFactorUnsetMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type TwoFactorUnsetMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'twoFactorUnset'>
);

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verifyEmail'>
);

export type GetTwoFactorSecretQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTwoFactorSecretQuery = (
  { __typename?: 'Query' }
  & { twoFactorSecret?: Maybe<(
    { __typename?: 'TwoFactorSecretKey' }
    & Pick<TwoFactorSecretKey, 'ascii' | 'base32' | 'hex' | 'qr_code_ascii' | 'qr_code_hex' | 'qr_code_base32' | 'google_auth_qr' | 'otpauth_url'>
  )> }
);

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { getUser?: Maybe<(
    { __typename?: 'User' }
    & UserFieldsFragment
  )> }
);

export const AssociationResultFragmentDoc: DocumentNode<AssociationResultFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"associationResult"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssociationResult"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OTPAssociationResult"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfaToken"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"authenticatorId"},"arguments":[],"directives":[]}]}}]}}]};
export const UserFieldsFragmentDoc: DocumentNode<UserFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"emails"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"verified"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"username"},"arguments":[],"directives":[]}]}}]};
export const AssociateDocument: DocumentNode<AssociateMutation, AssociateMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"associate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssociateParamsInput"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"associationResult"},"directives":[]}]}}]}},...AssociationResultFragmentDoc.definitions]};
export const AssociateByMfaTokenDocument: DocumentNode<AssociateByMfaTokenMutation, AssociateByMfaTokenMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"associateByMfaToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mfaToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssociateParamsInput"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associateByMfaToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mfaToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mfaToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"associationResult"},"directives":[]}]}}]}},...AssociationResultFragmentDoc.definitions]};
export const ChallengeDocument: DocumentNode<ChallengeMutation, ChallengeMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"challenge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mfaToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authenticatorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"challenge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mfaToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mfaToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"authenticatorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authenticatorId"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DefaultChallengeResult"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfaToken"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"authenticatorId"},"arguments":[],"directives":[]}]}}]}}]}}]};
export const AuthenticatorsDocument: DocumentNode<AuthenticatorsQuery, AuthenticatorsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"authenticators"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticators"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"type"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"active"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"activatedAt"},"arguments":[],"directives":[]}]}}]}}]};
export const AuthenticatorsByMfaTokenDocument: DocumentNode<AuthenticatorsByMfaTokenQuery, AuthenticatorsByMfaTokenQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"authenticatorsByMfaToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mfaToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticatorsByMfaToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mfaToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mfaToken"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"type"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"active"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"activatedAt"},"arguments":[],"directives":[]}]}}]}}]};
export const AddEmailDocument: DocumentNode<AddEmailMutation, AddEmailMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newEmail"}}}],"directives":[]}]}}]};
export const AuthenticateWithServiceDocument: DocumentNode<AuthenticateWithServiceMutation, AuthenticateWithServiceMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"authenticateWithService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serviceName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthenticateParamsInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyAuthentication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serviceName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serviceName"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"directives":[]}]}}]};
export const ChangePasswordDocument: DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"changePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}],"directives":[]}]}}]};
export const CreateUserDocument: DocumentNode<CreateUserMutation, CreateUserMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"loginResult"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"accessToken"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFields"},"directives":[]}]}}]}}]}}]}},...UserFieldsFragmentDoc.definitions]};
export const ImpersonateDocument: DocumentNode<ImpersonateMutation, ImpersonateMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"impersonate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"impersonated"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImpersonationUserIdentityInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"impersonate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accessToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"impersonated"},"value":{"kind":"Variable","name":{"kind":"Name","value":"impersonated"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authorized"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"accessToken"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFields"},"directives":[]}]}}]}}]}},...UserFieldsFragmentDoc.definitions]};
export const AuthenticateDocument: DocumentNode<AuthenticateMutation, AuthenticateMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"authenticate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serviceName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthenticateParamsInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serviceName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serviceName"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginResult"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"accessToken"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFields"},"directives":[]}]}}]}}]}}]}},...UserFieldsFragmentDoc.definitions]};
export const LogoutDocument: DocumentNode<LogoutMutation, LogoutMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[],"directives":[]}]}}]};
export const RefreshTokensDocument: DocumentNode<RefreshTokensMutation, RefreshTokensMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"refreshTokens"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshTokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accessToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"accessToken"},"arguments":[],"directives":[]}]}}]}}]}}]};
export const ResetPasswordDocument: DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"accessToken"},"arguments":[],"directives":[]}]}}]}}]}}]};
export const SendResetPasswordEmailDocument: DocumentNode<SendResetPasswordEmailMutation, SendResetPasswordEmailMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendResetPasswordEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendResetPasswordEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"directives":[]}]}}]};
export const SendVerificationEmailDocument: DocumentNode<SendVerificationEmailMutation, SendVerificationEmailMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendVerificationEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendVerificationEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"directives":[]}]}}]};
export const TwoFactorSetDocument: DocumentNode<TwoFactorSetMutation, TwoFactorSetMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"twoFactorSet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorSecretKeyInput"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactorSet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"directives":[]}]}}]};
export const TwoFactorUnsetDocument: DocumentNode<TwoFactorUnsetMutation, TwoFactorUnsetMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"twoFactorUnset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactorUnset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"directives":[]}]}}]};
export const VerifyEmailDocument: DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"verifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"directives":[]}]}}]};
export const GetTwoFactorSecretDocument: DocumentNode<GetTwoFactorSecretQuery, GetTwoFactorSecretQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTwoFactorSecret"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactorSecret"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ascii"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"base32"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"hex"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"qr_code_ascii"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"qr_code_hex"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"qr_code_base32"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"google_auth_qr"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"otpauth_url"},"arguments":[],"directives":[]}]}}]}}]};
export const GetUserDocument: DocumentNode<GetUserQuery, GetUserQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUser"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFields"},"directives":[]}]}}]}},...UserFieldsFragmentDoc.definitions]};