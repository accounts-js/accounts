/* eslint-disable */
import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  getUser?: Maybe<User>;
  twoFactorSecret?: Maybe<TwoFactorSecretKey>;
};

export type User = {
  __typename?: 'User';
  emails?: Maybe<Array<EmailRecord>>;
  id: Scalars['ID'];
  username?: Maybe<Scalars['String']>;
};

export type EmailRecord = {
  __typename?: 'EmailRecord';
  address?: Maybe<Scalars['String']>;
  verified?: Maybe<Scalars['Boolean']>;
};

export type TwoFactorSecretKey = {
  __typename?: 'TwoFactorSecretKey';
  ascii?: Maybe<Scalars['String']>;
  base32?: Maybe<Scalars['String']>;
  google_auth_qr?: Maybe<Scalars['String']>;
  hex?: Maybe<Scalars['String']>;
  otpauth_url?: Maybe<Scalars['String']>;
  qr_code_ascii?: Maybe<Scalars['String']>;
  qr_code_base32?: Maybe<Scalars['String']>;
  qr_code_hex?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addEmail?: Maybe<Scalars['Boolean']>;
  authenticate?: Maybe<LoginResult>;
  changePassword?: Maybe<Scalars['Boolean']>;
  createUser?: Maybe<CreateUserResult>;
  impersonate?: Maybe<ImpersonateReturn>;
  logout?: Maybe<Scalars['Boolean']>;
  refreshTokens?: Maybe<LoginResult>;
  requestMagicLinkEmail?: Maybe<Scalars['Boolean']>;
  resetPassword?: Maybe<LoginResult>;
  sendResetPasswordEmail?: Maybe<Scalars['Boolean']>;
  sendVerificationEmail?: Maybe<Scalars['Boolean']>;
  twoFactorSet?: Maybe<Scalars['Boolean']>;
  twoFactorUnset?: Maybe<Scalars['Boolean']>;
  verifyAuthentication?: Maybe<Scalars['Boolean']>;
  verifyEmail?: Maybe<Scalars['Boolean']>;
};


export type MutationAddEmailArgs = {
  newEmail: Scalars['String'];
};


export type MutationAuthenticateArgs = {
  params: AuthenticateParamsInput;
  serviceName: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationCreateUserArgs = {
  user: CreateUserInput;
};


export type MutationImpersonateArgs = {
  accessToken: Scalars['String'];
  impersonated: ImpersonationUserIdentityInput;
};


export type MutationRefreshTokensArgs = {
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};


export type MutationRequestMagicLinkEmailArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationSendVerificationEmailArgs = {
  email: Scalars['String'];
};


export type MutationTwoFactorSetArgs = {
  code: Scalars['String'];
  secret: TwoFactorSecretKeyInput;
};


export type MutationTwoFactorUnsetArgs = {
  code: Scalars['String'];
};


export type MutationVerifyAuthenticationArgs = {
  params: AuthenticateParamsInput;
  serviceName: Scalars['String'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};

export type AuthenticateParamsInput = {
  access_token?: Maybe<Scalars['String']>;
  access_token_secret?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  user?: Maybe<UserInput>;
};

export type UserInput = {
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  username?: Maybe<Scalars['String']>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  sessionId?: Maybe<Scalars['String']>;
  tokens?: Maybe<Tokens>;
  user?: Maybe<User>;
};

export type Tokens = {
  __typename?: 'Tokens';
  accessToken?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
};

export type CreateUserInput = {
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type CreateUserResult = {
  __typename?: 'CreateUserResult';
  loginResult?: Maybe<LoginResult>;
  userId?: Maybe<Scalars['ID']>;
};

export type ImpersonationUserIdentityInput = {
  email?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type ImpersonateReturn = {
  __typename?: 'ImpersonateReturn';
  authorized?: Maybe<Scalars['Boolean']>;
  tokens?: Maybe<Tokens>;
  user?: Maybe<User>;
};

export type TwoFactorSecretKeyInput = {
  ascii?: Maybe<Scalars['String']>;
  base32?: Maybe<Scalars['String']>;
  google_auth_qr?: Maybe<Scalars['String']>;
  hex?: Maybe<Scalars['String']>;
  otpauth_url?: Maybe<Scalars['String']>;
  qr_code_ascii?: Maybe<Scalars['String']>;
  qr_code_base32?: Maybe<Scalars['String']>;
  qr_code_hex?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

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
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  Query: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  EmailRecord: ResolverTypeWrapper<EmailRecord>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  TwoFactorSecretKey: ResolverTypeWrapper<TwoFactorSecretKey>;
  Mutation: ResolverTypeWrapper<{}>;
  AuthenticateParamsInput: AuthenticateParamsInput;
  UserInput: UserInput;
  LoginResult: ResolverTypeWrapper<LoginResult>;
  Tokens: ResolverTypeWrapper<Tokens>;
  CreateUserInput: CreateUserInput;
  CreateUserResult: ResolverTypeWrapper<CreateUserResult>;
  ImpersonationUserIdentityInput: ImpersonationUserIdentityInput;
  ImpersonateReturn: ResolverTypeWrapper<ImpersonateReturn>;
  TwoFactorSecretKeyInput: TwoFactorSecretKeyInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  User: User;
  EmailRecord: EmailRecord;
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  TwoFactorSecretKey: TwoFactorSecretKey;
  Mutation: {};
  AuthenticateParamsInput: AuthenticateParamsInput;
  UserInput: UserInput;
  LoginResult: LoginResult;
  Tokens: Tokens;
  CreateUserInput: CreateUserInput;
  CreateUserResult: CreateUserResult;
  ImpersonationUserIdentityInput: ImpersonationUserIdentityInput;
  ImpersonateReturn: ImpersonateReturn;
  TwoFactorSecretKeyInput: TwoFactorSecretKeyInput;
};

export type AuthDirectiveArgs = { };

export type AuthDirectiveResolver<Result, Parent, ContextType = any, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  twoFactorSecret?: Resolver<Maybe<ResolversTypes['TwoFactorSecretKey']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  emails?: Resolver<Maybe<Array<ResolversTypes['EmailRecord']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmailRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailRecord'] = ResolversParentTypes['EmailRecord']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TwoFactorSecretKeyResolvers<ContextType = any, ParentType extends ResolversParentTypes['TwoFactorSecretKey'] = ResolversParentTypes['TwoFactorSecretKey']> = {
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

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationAddEmailArgs, 'newEmail'>>;
  authenticate?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationAuthenticateArgs, 'params' | 'serviceName'>>;
  changePassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'oldPassword'>>;
  createUser?: Resolver<Maybe<ResolversTypes['CreateUserResult']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'user'>>;
  impersonate?: Resolver<Maybe<ResolversTypes['ImpersonateReturn']>, ParentType, ContextType, RequireFields<MutationImpersonateArgs, 'accessToken' | 'impersonated'>>;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  refreshTokens?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationRefreshTokensArgs, 'accessToken' | 'refreshToken'>>;
  requestMagicLinkEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRequestMagicLinkEmailArgs, 'email'>>;
  resetPassword?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'newPassword' | 'token'>>;
  sendResetPasswordEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendResetPasswordEmailArgs, 'email'>>;
  sendVerificationEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendVerificationEmailArgs, 'email'>>;
  twoFactorSet?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationTwoFactorSetArgs, 'code' | 'secret'>>;
  twoFactorUnset?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationTwoFactorUnsetArgs, 'code'>>;
  verifyAuthentication?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationVerifyAuthenticationArgs, 'params' | 'serviceName'>>;
  verifyEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'token'>>;
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  sessionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokens?: Resolver<Maybe<ResolversTypes['Tokens']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokensResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tokens'] = ResolversParentTypes['Tokens']> = {
  accessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserResult'] = ResolversParentTypes['CreateUserResult']> = {
  loginResult?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImpersonateReturnResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImpersonateReturn'] = ResolversParentTypes['ImpersonateReturn']> = {
  authorized?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  tokens?: Resolver<Maybe<ResolversTypes['Tokens']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  EmailRecord?: EmailRecordResolvers<ContextType>;
  TwoFactorSecretKey?: TwoFactorSecretKeyResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  Tokens?: TokensResolvers<ContextType>;
  CreateUserResult?: CreateUserResultResolvers<ContextType>;
  ImpersonateReturn?: ImpersonateReturnResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>;
};
