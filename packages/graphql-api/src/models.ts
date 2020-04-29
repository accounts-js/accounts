/* eslint-disable */
import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};


export type AuthenticateParamsInput = {
  access_token?: Maybe<Scalars['String']>,
  access_token_secret?: Maybe<Scalars['String']>,
  provider?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>,
  user?: Maybe<UserInput>,
  code?: Maybe<Scalars['String']>,
};

export type AuthenticationResult = LoginResult | MultiFactorResult;

export type Authenticator = {
   __typename?: 'Authenticator',
  id?: Maybe<Scalars['ID']>,
  type?: Maybe<Scalars['String']>,
  active?: Maybe<Scalars['Boolean']>,
  activatedAt?: Maybe<Scalars['String']>,
};

export type ChallengeResult = Scalars['Boolean'];

export type CreateUserInput = {
  username?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>,
};

export type CreateUserResult = {
   __typename?: 'CreateUserResult',
  userId?: Maybe<Scalars['ID']>,
  loginResult?: Maybe<LoginResult>,
};

export type EmailRecord = {
   __typename?: 'EmailRecord',
  address?: Maybe<Scalars['String']>,
  verified?: Maybe<Scalars['Boolean']>,
};

export type ImpersonateReturn = {
   __typename?: 'ImpersonateReturn',
  authorized?: Maybe<Scalars['Boolean']>,
  tokens?: Maybe<Tokens>,
  user?: Maybe<User>,
};

export type LoginResult = {
   __typename?: 'LoginResult',
  sessionId?: Maybe<Scalars['String']>,
  tokens?: Maybe<Tokens>,
  user?: Maybe<User>,
};

export type MultiFactorResult = {
   __typename?: 'MultiFactorResult',
  mfaToken: Scalars['String'],
};

export type Mutation = {
   __typename?: 'Mutation',
  challenge?: Maybe<ChallengeResult>,
  createUser?: Maybe<CreateUserResult>,
  verifyEmail?: Maybe<Scalars['Boolean']>,
  resetPassword?: Maybe<LoginResult>,
  sendVerificationEmail?: Maybe<Scalars['Boolean']>,
  sendResetPasswordEmail?: Maybe<Scalars['Boolean']>,
  addEmail?: Maybe<Scalars['Boolean']>,
  changePassword?: Maybe<Scalars['Boolean']>,
  twoFactorSet?: Maybe<Scalars['Boolean']>,
  twoFactorUnset?: Maybe<Scalars['Boolean']>,
  impersonate?: Maybe<ImpersonateReturn>,
  refreshTokens?: Maybe<LoginResult>,
  logout?: Maybe<Scalars['Boolean']>,
  authenticate?: Maybe<AuthenticationResult>,
  verifyAuthentication?: Maybe<Scalars['Boolean']>,
};


export type MutationChallengeArgs = {
  mfaToken: Scalars['String'],
  authenticatorId: Scalars['String']
};


export type MutationCreateUserArgs = {
  user: CreateUserInput
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']
};


export type MutationResetPasswordArgs = {
  token: Scalars['String'],
  newPassword: Scalars['String']
};


export type MutationSendVerificationEmailArgs = {
  email: Scalars['String']
};


export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String']
};


export type MutationAddEmailArgs = {
  newEmail: Scalars['String']
};


export type MutationChangePasswordArgs = {
  oldPassword: Scalars['String'],
  newPassword: Scalars['String']
};


export type MutationTwoFactorSetArgs = {
  secret: TwoFactorSecretKeyInput,
  code: Scalars['String']
};


export type MutationTwoFactorUnsetArgs = {
  code: Scalars['String']
};


export type MutationImpersonateArgs = {
  accessToken: Scalars['String'],
  username: Scalars['String']
};


export type MutationRefreshTokensArgs = {
  accessToken: Scalars['String'],
  refreshToken: Scalars['String']
};


export type MutationAuthenticateArgs = {
  serviceName: Scalars['String'],
  params: AuthenticateParamsInput
};


export type MutationVerifyAuthenticationArgs = {
  serviceName: Scalars['String'],
  params: AuthenticateParamsInput
};

export type Query = {
   __typename?: 'Query',
  authenticators?: Maybe<Array<Maybe<Authenticator>>>,
  twoFactorSecret?: Maybe<TwoFactorSecretKey>,
  getUser?: Maybe<User>,
};


export type QueryAuthenticatorsArgs = {
  mfaToken?: Maybe<Scalars['String']>
};

export type Tokens = {
   __typename?: 'Tokens',
  refreshToken?: Maybe<Scalars['String']>,
  accessToken?: Maybe<Scalars['String']>,
};

export type TwoFactorSecretKey = {
   __typename?: 'TwoFactorSecretKey',
  ascii?: Maybe<Scalars['String']>,
  base32?: Maybe<Scalars['String']>,
  hex?: Maybe<Scalars['String']>,
  qr_code_ascii?: Maybe<Scalars['String']>,
  qr_code_hex?: Maybe<Scalars['String']>,
  qr_code_base32?: Maybe<Scalars['String']>,
  google_auth_qr?: Maybe<Scalars['String']>,
  otpauth_url?: Maybe<Scalars['String']>,
};

export type TwoFactorSecretKeyInput = {
  ascii?: Maybe<Scalars['String']>,
  base32?: Maybe<Scalars['String']>,
  hex?: Maybe<Scalars['String']>,
  qr_code_ascii?: Maybe<Scalars['String']>,
  qr_code_hex?: Maybe<Scalars['String']>,
  qr_code_base32?: Maybe<Scalars['String']>,
  google_auth_qr?: Maybe<Scalars['String']>,
  otpauth_url?: Maybe<Scalars['String']>,
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  emails?: Maybe<Array<EmailRecord>>,
  username?: Maybe<Scalars['String']>,
};

export type UserInput = {
  id?: Maybe<Scalars['ID']>,
  email?: Maybe<Scalars['String']>,
  username?: Maybe<Scalars['String']>,
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
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

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

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
  Query: ResolverTypeWrapper<{}>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Authenticator: ResolverTypeWrapper<Authenticator>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  TwoFactorSecretKey: ResolverTypeWrapper<TwoFactorSecretKey>,
  User: ResolverTypeWrapper<User>,
  EmailRecord: ResolverTypeWrapper<EmailRecord>,
  Mutation: ResolverTypeWrapper<{}>,
  ChallengeResult: ResolversTypes['Boolean'],
  CreateUserInput: CreateUserInput,
  CreateUserResult: ResolverTypeWrapper<CreateUserResult>,
  LoginResult: ResolverTypeWrapper<LoginResult>,
  Tokens: ResolverTypeWrapper<Tokens>,
  TwoFactorSecretKeyInput: TwoFactorSecretKeyInput,
  ImpersonateReturn: ResolverTypeWrapper<ImpersonateReturn>,
  AuthenticateParamsInput: AuthenticateParamsInput,
  UserInput: UserInput,
  AuthenticationResult: ResolversTypes['LoginResult'] | ResolversTypes['MultiFactorResult'],
  MultiFactorResult: ResolverTypeWrapper<MultiFactorResult>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  String: Scalars['String'],
  Authenticator: Authenticator,
  ID: Scalars['ID'],
  Boolean: Scalars['Boolean'],
  TwoFactorSecretKey: TwoFactorSecretKey,
  User: User,
  EmailRecord: EmailRecord,
  Mutation: {},
  ChallengeResult: ResolversParentTypes['Boolean'],
  CreateUserInput: CreateUserInput,
  CreateUserResult: CreateUserResult,
  LoginResult: LoginResult,
  Tokens: Tokens,
  TwoFactorSecretKeyInput: TwoFactorSecretKeyInput,
  ImpersonateReturn: ImpersonateReturn,
  AuthenticateParamsInput: AuthenticateParamsInput,
  UserInput: UserInput,
  AuthenticationResult: ResolversParentTypes['LoginResult'] | ResolversParentTypes['MultiFactorResult'],
  MultiFactorResult: MultiFactorResult,
};

export type AuthDirectiveResolver<Result, Parent, ContextType = any, Args = {  }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthenticationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthenticationResult'] = ResolversParentTypes['AuthenticationResult']> = {
  __resolveType: TypeResolveFn<'LoginResult' | 'MultiFactorResult', ParentType, ContextType>
};

export type AuthenticatorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Authenticator'] = ResolversParentTypes['Authenticator']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  activatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type ChallengeResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChallengeResult'] = ResolversParentTypes['ChallengeResult']> = {
  __resolveType: TypeResolveFn<'Boolean', ParentType, ContextType>
};

export type CreateUserResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserResult'] = ResolversParentTypes['CreateUserResult']> = {
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>,
  loginResult?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType>,
};

export type EmailRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailRecord'] = ResolversParentTypes['EmailRecord']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  verified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
};

export type ImpersonateReturnResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImpersonateReturn'] = ResolversParentTypes['ImpersonateReturn']> = {
  authorized?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  tokens?: Resolver<Maybe<ResolversTypes['Tokens']>, ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  sessionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  tokens?: Resolver<Maybe<ResolversTypes['Tokens']>, ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
};

export type MultiFactorResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MultiFactorResult'] = ResolversParentTypes['MultiFactorResult']> = {
  mfaToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  challenge?: Resolver<Maybe<ResolversTypes['ChallengeResult']>, ParentType, ContextType, RequireFields<MutationChallengeArgs, 'mfaToken' | 'authenticatorId'>>,
  createUser?: Resolver<Maybe<ResolversTypes['CreateUserResult']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'user'>>,
  verifyEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'token'>>,
  resetPassword?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'token' | 'newPassword'>>,
  sendVerificationEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendVerificationEmailArgs, 'email'>>,
  sendResetPasswordEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendResetPasswordEmailArgs, 'email'>>,
  addEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationAddEmailArgs, 'newEmail'>>,
  changePassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'oldPassword' | 'newPassword'>>,
  twoFactorSet?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationTwoFactorSetArgs, 'secret' | 'code'>>,
  twoFactorUnset?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationTwoFactorUnsetArgs, 'code'>>,
  impersonate?: Resolver<Maybe<ResolversTypes['ImpersonateReturn']>, ParentType, ContextType, RequireFields<MutationImpersonateArgs, 'accessToken' | 'username'>>,
  refreshTokens?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationRefreshTokensArgs, 'accessToken' | 'refreshToken'>>,
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  authenticate?: Resolver<Maybe<ResolversTypes['AuthenticationResult']>, ParentType, ContextType, RequireFields<MutationAuthenticateArgs, 'serviceName' | 'params'>>,
  verifyAuthentication?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationVerifyAuthenticationArgs, 'serviceName' | 'params'>>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authenticators?: Resolver<Maybe<Array<Maybe<ResolversTypes['Authenticator']>>>, ParentType, ContextType, QueryAuthenticatorsArgs>,
  twoFactorSecret?: Resolver<Maybe<ResolversTypes['TwoFactorSecretKey']>, ParentType, ContextType>,
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
};

export type TokensResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tokens'] = ResolversParentTypes['Tokens']> = {
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  accessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type TwoFactorSecretKeyResolvers<ContextType = any, ParentType extends ResolversParentTypes['TwoFactorSecretKey'] = ResolversParentTypes['TwoFactorSecretKey']> = {
  ascii?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  base32?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  hex?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  qr_code_ascii?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  qr_code_hex?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  qr_code_base32?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  google_auth_qr?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  otpauth_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  emails?: Resolver<Maybe<Array<ResolversTypes['EmailRecord']>>, ParentType, ContextType>,
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  AuthenticationResult?: AuthenticationResultResolvers,
  Authenticator?: AuthenticatorResolvers<ContextType>,
  ChallengeResult?: ChallengeResultResolvers,
  CreateUserResult?: CreateUserResultResolvers<ContextType>,
  EmailRecord?: EmailRecordResolvers<ContextType>,
  ImpersonateReturn?: ImpersonateReturnResolvers<ContextType>,
  LoginResult?: LoginResultResolvers<ContextType>,
  MultiFactorResult?: MultiFactorResultResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Tokens?: TokensResolvers<ContextType>,
  TwoFactorSecretKey?: TwoFactorSecretKeyResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>,
};


/**
* @deprecated
* Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
*/
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;
