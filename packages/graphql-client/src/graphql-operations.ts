/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthenticateParamsInput = {
  access_token?: InputMaybe<Scalars['String']['input']>;
  access_token_secret?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UserInput>;
};

export type CreateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserResult = {
  __typename?: 'CreateUserResult';
  loginResult?: Maybe<LoginResult>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type EmailRecord = {
  __typename?: 'EmailRecord';
  address?: Maybe<Scalars['String']['output']>;
  verified?: Maybe<Scalars['Boolean']['output']>;
};

export type ImpersonateReturn = {
  __typename?: 'ImpersonateReturn';
  authorized?: Maybe<Scalars['Boolean']['output']>;
  tokens?: Maybe<Tokens>;
  user?: Maybe<User>;
};

export type ImpersonationUserIdentityInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  sessionId?: Maybe<Scalars['String']['output']>;
  tokens?: Maybe<Tokens>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addEmail?: Maybe<Scalars['Boolean']['output']>;
  authenticate?: Maybe<LoginResult>;
  changePassword?: Maybe<Scalars['Boolean']['output']>;
  createUser?: Maybe<CreateUserResult>;
  impersonate?: Maybe<ImpersonateReturn>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  refreshTokens?: Maybe<LoginResult>;
  requestMagicLinkEmail?: Maybe<Scalars['Boolean']['output']>;
  resetPassword?: Maybe<LoginResult>;
  sendResetPasswordEmail?: Maybe<Scalars['Boolean']['output']>;
  sendVerificationEmail?: Maybe<Scalars['Boolean']['output']>;
  twoFactorSet?: Maybe<Scalars['Boolean']['output']>;
  twoFactorUnset?: Maybe<Scalars['Boolean']['output']>;
  verifyAuthentication?: Maybe<Scalars['Boolean']['output']>;
  verifyEmail?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationAddEmailArgs = {
  newEmail: Scalars['String']['input'];
};


export type MutationAuthenticateArgs = {
  params: AuthenticateParamsInput;
  serviceName: Scalars['String']['input'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  user: CreateUserInput;
};


export type MutationImpersonateArgs = {
  accessToken: Scalars['String']['input'];
  impersonated: ImpersonationUserIdentityInput;
};


export type MutationRefreshTokensArgs = {
  accessToken: Scalars['String']['input'];
  refreshToken: Scalars['String']['input'];
};


export type MutationRequestMagicLinkEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationSendVerificationEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationTwoFactorSetArgs = {
  code: Scalars['String']['input'];
  secret: TwoFactorSecretKeyInput;
};


export type MutationTwoFactorUnsetArgs = {
  code: Scalars['String']['input'];
};


export type MutationVerifyAuthenticationArgs = {
  params: AuthenticateParamsInput;
  serviceName: Scalars['String']['input'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getUser?: Maybe<User>;
  twoFactorSecret?: Maybe<TwoFactorSecretKey>;
};

export type Tokens = {
  __typename?: 'Tokens';
  accessToken?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
};

export type TwoFactorSecretKey = {
  __typename?: 'TwoFactorSecretKey';
  ascii?: Maybe<Scalars['String']['output']>;
  base32?: Maybe<Scalars['String']['output']>;
  google_auth_qr?: Maybe<Scalars['String']['output']>;
  hex?: Maybe<Scalars['String']['output']>;
  otpauth_url?: Maybe<Scalars['String']['output']>;
  qr_code_ascii?: Maybe<Scalars['String']['output']>;
  qr_code_base32?: Maybe<Scalars['String']['output']>;
  qr_code_hex?: Maybe<Scalars['String']['output']>;
};

export type TwoFactorSecretKeyInput = {
  ascii?: InputMaybe<Scalars['String']['input']>;
  base32?: InputMaybe<Scalars['String']['input']>;
  google_auth_qr?: InputMaybe<Scalars['String']['input']>;
  hex?: InputMaybe<Scalars['String']['input']>;
  otpauth_url?: InputMaybe<Scalars['String']['input']>;
  qr_code_ascii?: InputMaybe<Scalars['String']['input']>;
  qr_code_base32?: InputMaybe<Scalars['String']['input']>;
  qr_code_hex?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  emails?: Maybe<Array<EmailRecord>>;
  id: Scalars['ID']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type UserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UserFieldsFragment = { __typename?: 'User', id: string, username?: string | null, emails?: Array<{ __typename?: 'EmailRecord', address?: string | null, verified?: boolean | null }> | null };

export type AddEmailMutationVariables = Exact<{
  newEmail: Scalars['String']['input'];
}>;


export type AddEmailMutation = { __typename?: 'Mutation', addEmail?: boolean | null };

export type AuthenticateWithServiceMutationVariables = Exact<{
  serviceName: Scalars['String']['input'];
  params: AuthenticateParamsInput;
}>;


export type AuthenticateWithServiceMutation = { __typename?: 'Mutation', verifyAuthentication?: boolean | null };

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword?: boolean | null };

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'CreateUserResult', userId?: string | null, loginResult?: { __typename?: 'LoginResult', sessionId?: string | null, tokens?: { __typename?: 'Tokens', refreshToken?: string | null, accessToken?: string | null } | null, user?: { __typename?: 'User', id: string, username?: string | null, emails?: Array<{ __typename?: 'EmailRecord', address?: string | null, verified?: boolean | null }> | null } | null } | null } | null };

export type ImpersonateMutationVariables = Exact<{
  accessToken: Scalars['String']['input'];
  impersonated: ImpersonationUserIdentityInput;
}>;


export type ImpersonateMutation = { __typename?: 'Mutation', impersonate?: { __typename?: 'ImpersonateReturn', authorized?: boolean | null, tokens?: { __typename?: 'Tokens', refreshToken?: string | null, accessToken?: string | null } | null, user?: { __typename?: 'User', id: string, username?: string | null, emails?: Array<{ __typename?: 'EmailRecord', address?: string | null, verified?: boolean | null }> | null } | null } | null };

export type AuthenticateMutationVariables = Exact<{
  serviceName: Scalars['String']['input'];
  params: AuthenticateParamsInput;
}>;


export type AuthenticateMutation = { __typename?: 'Mutation', authenticate?: { __typename?: 'LoginResult', sessionId?: string | null, tokens?: { __typename?: 'Tokens', refreshToken?: string | null, accessToken?: string | null } | null, user?: { __typename?: 'User', id: string, username?: string | null, emails?: Array<{ __typename?: 'EmailRecord', address?: string | null, verified?: boolean | null }> | null } | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: boolean | null };

export type RefreshTokensMutationVariables = Exact<{
  accessToken: Scalars['String']['input'];
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokensMutation = { __typename?: 'Mutation', refreshTokens?: { __typename?: 'LoginResult', sessionId?: string | null, tokens?: { __typename?: 'Tokens', refreshToken?: string | null, accessToken?: string | null } | null } | null };

export type RequestMagicLinkEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestMagicLinkEmailMutation = { __typename?: 'Mutation', requestMagicLinkEmail?: boolean | null };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword?: { __typename?: 'LoginResult', sessionId?: string | null, tokens?: { __typename?: 'Tokens', refreshToken?: string | null, accessToken?: string | null } | null } | null };

export type SendResetPasswordEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendResetPasswordEmailMutation = { __typename?: 'Mutation', sendResetPasswordEmail?: boolean | null };

export type SendVerificationEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendVerificationEmailMutation = { __typename?: 'Mutation', sendVerificationEmail?: boolean | null };

export type TwoFactorSetMutationVariables = Exact<{
  secret: TwoFactorSecretKeyInput;
  code: Scalars['String']['input'];
}>;


export type TwoFactorSetMutation = { __typename?: 'Mutation', twoFactorSet?: boolean | null };

export type TwoFactorUnsetMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type TwoFactorUnsetMutation = { __typename?: 'Mutation', twoFactorUnset?: boolean | null };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail?: boolean | null };

export type GetTwoFactorSecretQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTwoFactorSecretQuery = { __typename?: 'Query', twoFactorSecret?: { __typename?: 'TwoFactorSecretKey', ascii?: string | null, base32?: string | null, hex?: string | null, qr_code_ascii?: string | null, qr_code_hex?: string | null, qr_code_base32?: string | null, google_auth_qr?: string | null, otpauth_url?: string | null } | null };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: string, username?: string | null, emails?: Array<{ __typename?: 'EmailRecord', address?: string | null, verified?: boolean | null }> | null } | null };

export const UserFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]} as unknown as DocumentNode<UserFieldsFragment, unknown>;
export const AddEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newEmail"}}}]}]}}]} as unknown as DocumentNode<AddEmailMutation, AddEmailMutationVariables>;
export const AuthenticateWithServiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"authenticateWithService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serviceName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthenticateParamsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyAuthentication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serviceName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serviceName"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}]}]}}]} as unknown as DocumentNode<AuthenticateWithServiceMutation, AuthenticateWithServiceMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"changePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}]}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"loginResult"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const ImpersonateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"impersonate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"impersonated"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImpersonationUserIdentityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"impersonate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accessToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"impersonated"},"value":{"kind":"Variable","name":{"kind":"Name","value":"impersonated"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authorized"}},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]} as unknown as DocumentNode<ImpersonateMutation, ImpersonateMutationVariables>;
export const AuthenticateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"authenticate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serviceName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthenticateParamsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serviceName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serviceName"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]} as unknown as DocumentNode<AuthenticateMutation, AuthenticateMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RefreshTokensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"refreshTokens"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshTokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accessToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]}}]} as unknown as DocumentNode<RefreshTokensMutation, RefreshTokensMutationVariables>;
export const RequestMagicLinkEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"requestMagicLinkEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestMagicLinkEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<RequestMagicLinkEmailMutation, RequestMagicLinkEmailMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SendResetPasswordEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendResetPasswordEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendResetPasswordEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<SendResetPasswordEmailMutation, SendResetPasswordEmailMutationVariables>;
export const SendVerificationEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendVerificationEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendVerificationEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>;
export const TwoFactorSetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"twoFactorSet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorSecretKeyInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactorSet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<TwoFactorSetMutation, TwoFactorSetMutationVariables>;
export const TwoFactorUnsetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"twoFactorUnset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactorUnset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<TwoFactorUnsetMutation, TwoFactorUnsetMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"verifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const GetTwoFactorSecretDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTwoFactorSecret"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactorSecret"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ascii"}},{"kind":"Field","name":{"kind":"Name","value":"base32"}},{"kind":"Field","name":{"kind":"Name","value":"hex"}},{"kind":"Field","name":{"kind":"Name","value":"qr_code_ascii"}},{"kind":"Field","name":{"kind":"Name","value":"qr_code_hex"}},{"kind":"Field","name":{"kind":"Name","value":"qr_code_base32"}},{"kind":"Field","name":{"kind":"Name","value":"google_auth_qr"}},{"kind":"Field","name":{"kind":"Name","value":"otpauth_url"}}]}}]}}]} as unknown as DocumentNode<GetTwoFactorSecretQuery, GetTwoFactorSecretQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;