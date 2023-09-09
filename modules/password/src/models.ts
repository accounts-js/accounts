/* eslint-disable */
import { GraphQLResolveInfo } from 'graphql';
import { AccountsContextGraphQLModules } from '@accounts/module-core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
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

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<
  TResult,
  TParent,
  TContext,
  TArgs
>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthenticateParamsInput: AuthenticateParamsInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateUserInput: CreateUserInput;
  CreateUserResult: ResolverTypeWrapper<CreateUserResult>;
  EmailRecord: ResolverTypeWrapper<EmailRecord>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ImpersonateReturn: ResolverTypeWrapper<ImpersonateReturn>;
  ImpersonationUserIdentityInput: ImpersonationUserIdentityInput;
  LoginResult: ResolverTypeWrapper<LoginResult>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tokens: ResolverTypeWrapper<Tokens>;
  TwoFactorSecretKey: ResolverTypeWrapper<TwoFactorSecretKey>;
  TwoFactorSecretKeyInput: TwoFactorSecretKeyInput;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthenticateParamsInput: AuthenticateParamsInput;
  Boolean: Scalars['Boolean']['output'];
  CreateUserInput: CreateUserInput;
  CreateUserResult: CreateUserResult;
  EmailRecord: EmailRecord;
  ID: Scalars['ID']['output'];
  ImpersonateReturn: ImpersonateReturn;
  ImpersonationUserIdentityInput: ImpersonationUserIdentityInput;
  LoginResult: LoginResult;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Tokens: Tokens;
  TwoFactorSecretKey: TwoFactorSecretKey;
  TwoFactorSecretKeyInput: TwoFactorSecretKeyInput;
  User: User;
  UserInput: UserInput;
};

export type CreateUserResultResolvers<
  ContextType = AccountsContextGraphQLModules,
  ParentType extends
    ResolversParentTypes['CreateUserResult'] = ResolversParentTypes['CreateUserResult'],
> = {
  loginResult?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmailRecordResolvers<
  ContextType = AccountsContextGraphQLModules,
  ParentType extends ResolversParentTypes['EmailRecord'] = ResolversParentTypes['EmailRecord'],
> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImpersonateReturnResolvers<
  ContextType = AccountsContextGraphQLModules,
  ParentType extends
    ResolversParentTypes['ImpersonateReturn'] = ResolversParentTypes['ImpersonateReturn'],
> = {
  authorized?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  tokens?: Resolver<Maybe<ResolversTypes['Tokens']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResultResolvers<
  ContextType = AccountsContextGraphQLModules,
  ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult'],
> = {
  sessionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokens?: Resolver<Maybe<ResolversTypes['Tokens']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = AccountsContextGraphQLModules,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  addEmail?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationAddEmailArgs, 'newEmail'>
  >;
  authenticate?: Resolver<
    Maybe<ResolversTypes['LoginResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationAuthenticateArgs, 'params' | 'serviceName'>
  >;
  changePassword?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationChangePasswordArgs, 'newPassword' | 'oldPassword'>
  >;
  createUser?: Resolver<
    Maybe<ResolversTypes['CreateUserResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, 'user'>
  >;
  impersonate?: Resolver<
    Maybe<ResolversTypes['ImpersonateReturn']>,
    ParentType,
    ContextType,
    RequireFields<MutationImpersonateArgs, 'accessToken' | 'impersonated'>
  >;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  refreshTokens?: Resolver<
    Maybe<ResolversTypes['LoginResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationRefreshTokensArgs, 'accessToken' | 'refreshToken'>
  >;
  resetPassword?: Resolver<
    Maybe<ResolversTypes['LoginResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationResetPasswordArgs, 'newPassword' | 'token'>
  >;
  sendResetPasswordEmail?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationSendResetPasswordEmailArgs, 'email'>
  >;
  sendVerificationEmail?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationSendVerificationEmailArgs, 'email'>
  >;
  twoFactorSet?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationTwoFactorSetArgs, 'code' | 'secret'>
  >;
  twoFactorUnset?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationTwoFactorUnsetArgs, 'code'>
  >;
  verifyAuthentication?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationVerifyAuthenticationArgs, 'params' | 'serviceName'>
  >;
  verifyEmail?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationVerifyEmailArgs, 'token'>
  >;
};

export type QueryResolvers<
  ContextType = AccountsContextGraphQLModules,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  twoFactorSecret?: Resolver<Maybe<ResolversTypes['TwoFactorSecretKey']>, ParentType, ContextType>;
};

export type TokensResolvers<
  ContextType = AccountsContextGraphQLModules,
  ParentType extends ResolversParentTypes['Tokens'] = ResolversParentTypes['Tokens'],
> = {
  accessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TwoFactorSecretKeyResolvers<
  ContextType = AccountsContextGraphQLModules,
  ParentType extends
    ResolversParentTypes['TwoFactorSecretKey'] = ResolversParentTypes['TwoFactorSecretKey'],
> = {
  ascii?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  base32?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  google_auth_qr?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hex?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  otpauth_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qr_code_ascii?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qr_code_base32?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qr_code_hex?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = AccountsContextGraphQLModules,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  emails?: Resolver<Maybe<Array<ResolversTypes['EmailRecord']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = AccountsContextGraphQLModules> = {
  CreateUserResult?: CreateUserResultResolvers<ContextType>;
  EmailRecord?: EmailRecordResolvers<ContextType>;
  ImpersonateReturn?: ImpersonateReturnResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tokens?: TokensResolvers<ContextType>;
  TwoFactorSecretKey?: TwoFactorSecretKeyResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
