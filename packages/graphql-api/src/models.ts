/* tslint:disable */
export type Maybe<T> = T | null;

export interface CreateUserInput {
  username?: Maybe<string>;

  email?: Maybe<string>;

  password?: Maybe<string>;
}

export interface TwoFactorSecretKeyInput {
  ascii?: Maybe<string>;

  base32?: Maybe<string>;

  hex?: Maybe<string>;

  qr_code_ascii?: Maybe<string>;

  qr_code_hex?: Maybe<string>;

  qr_code_base32?: Maybe<string>;

  google_auth_qr?: Maybe<string>;

  otpauth_url?: Maybe<string>;
}

export interface AuthenticateParamsInput {
  access_token?: Maybe<string>;

  access_token_secret?: Maybe<string>;

  provider?: Maybe<string>;

  password?: Maybe<string>;

  user?: Maybe<UserInput>;

  code?: Maybe<string>;
}

export interface UserInput {
  id?: Maybe<string>;

  email?: Maybe<string>;

  username?: Maybe<string>;
}

// ====================================================
// Types
// ====================================================

export interface Query {
  twoFactorSecret?: Maybe<TwoFactorSecretKey>;

  getUser?: Maybe<User>;
}

export interface TwoFactorSecretKey {
  ascii?: Maybe<string>;

  base32?: Maybe<string>;

  hex?: Maybe<string>;

  qr_code_ascii?: Maybe<string>;

  qr_code_hex?: Maybe<string>;

  qr_code_base32?: Maybe<string>;

  google_auth_qr?: Maybe<string>;

  otpauth_url?: Maybe<string>;
}

export interface User {
  id: string;

  emails?: Maybe<EmailRecord[]>;

  username?: Maybe<string>;
}

export interface EmailRecord {
  address?: Maybe<string>;

  verified?: Maybe<boolean>;
}

export interface Mutation {
  createUser?: Maybe<string>;

  verifyEmail?: Maybe<boolean>;

  resetPassword?: Maybe<LoginResult>;

  sendVerificationEmail?: Maybe<boolean>;

  sendResetPasswordEmail?: Maybe<boolean>;

  changePassword?: Maybe<boolean>;

  twoFactorSet?: Maybe<boolean>;

  twoFactorUnset?: Maybe<boolean>;

  impersonate?: Maybe<ImpersonateReturn>;

  refreshTokens?: Maybe<LoginResult>;

  logout?: Maybe<boolean>;

  authenticate?: Maybe<LoginResult>;
}

export interface LoginResult {
  sessionId?: Maybe<string>;

  tokens?: Maybe<Tokens>;
}

export interface Tokens {
  refreshToken?: Maybe<string>;

  accessToken?: Maybe<string>;
}

export interface ImpersonateReturn {
  authorized?: Maybe<boolean>;

  tokens?: Maybe<Tokens>;

  user?: Maybe<User>;
}

// ====================================================
// Arguments
// ====================================================

export interface CreateUserMutationArgs {
  user: CreateUserInput;
}
export interface VerifyEmailMutationArgs {
  token: string;
}
export interface ResetPasswordMutationArgs {
  token: string;

  newPassword: string;
}
export interface SendVerificationEmailMutationArgs {
  email: string;
}
export interface SendResetPasswordEmailMutationArgs {
  email: string;
}
export interface ChangePasswordMutationArgs {
  oldPassword: string;

  newPassword: string;
}
export interface TwoFactorSetMutationArgs {
  secret: TwoFactorSecretKeyInput;

  code: string;
}
export interface TwoFactorUnsetMutationArgs {
  code: string;
}
export interface ImpersonateMutationArgs {
  accessToken: string;

  username: string;
}
export interface RefreshTokensMutationArgs {
  accessToken: string;

  refreshToken: string;
}
export interface AuthenticateMutationArgs {
  serviceName: string;

  params: AuthenticateParamsInput;
}

import { GraphQLResolveInfo } from 'graphql';

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<Result, Parent = {}, Context = {}, Args = {}> =
  | ((...args: any[]) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface QueryResolvers<Context = {}, TypeParent = {}> {
  twoFactorSecret?: QueryTwoFactorSecretResolver<Maybe<TwoFactorSecretKey>, TypeParent, Context>;

  getUser?: QueryGetUserResolver<Maybe<User>, TypeParent, Context>;
}

export type QueryTwoFactorSecretResolver<
  R = Maybe<TwoFactorSecretKey>,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context>;
export type QueryGetUserResolver<R = Maybe<User>, Parent = {}, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;

export interface TwoFactorSecretKeyResolvers<Context = {}, TypeParent = TwoFactorSecretKey> {
  ascii?: TwoFactorSecretKeyAsciiResolver<Maybe<string>, TypeParent, Context>;

  base32?: TwoFactorSecretKeyBase32Resolver<Maybe<string>, TypeParent, Context>;

  hex?: TwoFactorSecretKeyHexResolver<Maybe<string>, TypeParent, Context>;

  qr_code_ascii?: TwoFactorSecretKeyQrCodeAsciiResolver<Maybe<string>, TypeParent, Context>;

  qr_code_hex?: TwoFactorSecretKeyQrCodeHexResolver<Maybe<string>, TypeParent, Context>;

  qr_code_base32?: TwoFactorSecretKeyQrCodeBase32Resolver<Maybe<string>, TypeParent, Context>;

  google_auth_qr?: TwoFactorSecretKeyGoogleAuthQrResolver<Maybe<string>, TypeParent, Context>;

  otpauth_url?: TwoFactorSecretKeyOtpauthUrlResolver<Maybe<string>, TypeParent, Context>;
}

export type TwoFactorSecretKeyAsciiResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyBase32Resolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyHexResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyQrCodeAsciiResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyQrCodeHexResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyQrCodeBase32Resolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyGoogleAuthQrResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyOtpauthUrlResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;

export interface UserResolvers<Context = {}, TypeParent = User> {
  id?: UserIdResolver<string, TypeParent, Context>;

  emails?: UserEmailsResolver<Maybe<EmailRecord[]>, TypeParent, Context>;

  username?: UserUsernameResolver<Maybe<string>, TypeParent, Context>;
}

export type UserIdResolver<R = string, Parent = User, Context = {}> = Resolver<R, Parent, Context>;
export type UserEmailsResolver<R = Maybe<EmailRecord[]>, Parent = User, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;
export type UserUsernameResolver<R = Maybe<string>, Parent = User, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;

export interface EmailRecordResolvers<Context = {}, TypeParent = EmailRecord> {
  address?: EmailRecordAddressResolver<Maybe<string>, TypeParent, Context>;

  verified?: EmailRecordVerifiedResolver<Maybe<boolean>, TypeParent, Context>;
}

export type EmailRecordAddressResolver<
  R = Maybe<string>,
  Parent = EmailRecord,
  Context = {}
> = Resolver<R, Parent, Context>;
export type EmailRecordVerifiedResolver<
  R = Maybe<boolean>,
  Parent = EmailRecord,
  Context = {}
> = Resolver<R, Parent, Context>;

export interface MutationResolvers<Context = {}, TypeParent = {}> {
  createUser?: MutationCreateUserResolver<Maybe<string>, TypeParent, Context>;

  verifyEmail?: MutationVerifyEmailResolver<Maybe<boolean>, TypeParent, Context>;

  resetPassword?: MutationResetPasswordResolver<Maybe<LoginResult>, TypeParent, Context>;

  sendVerificationEmail?: MutationSendVerificationEmailResolver<
    Maybe<boolean>,
    TypeParent,
    Context
  >;

  sendResetPasswordEmail?: MutationSendResetPasswordEmailResolver<
    Maybe<boolean>,
    TypeParent,
    Context
  >;

  changePassword?: MutationChangePasswordResolver<Maybe<boolean>, TypeParent, Context>;

  twoFactorSet?: MutationTwoFactorSetResolver<Maybe<boolean>, TypeParent, Context>;

  twoFactorUnset?: MutationTwoFactorUnsetResolver<Maybe<boolean>, TypeParent, Context>;

  impersonate?: MutationImpersonateResolver<Maybe<ImpersonateReturn>, TypeParent, Context>;

  refreshTokens?: MutationRefreshTokensResolver<Maybe<LoginResult>, TypeParent, Context>;

  logout?: MutationLogoutResolver<Maybe<boolean>, TypeParent, Context>;

  authenticate?: MutationAuthenticateResolver<Maybe<LoginResult>, TypeParent, Context>;
}

export type MutationCreateUserResolver<R = Maybe<string>, Parent = {}, Context = {}> = Resolver<
  R,
  Parent,
  Context,
  MutationCreateUserArgs
>;
export interface MutationCreateUserArgs {
  user: CreateUserInput;
}

export type MutationVerifyEmailResolver<R = Maybe<boolean>, Parent = {}, Context = {}> = Resolver<
  R,
  Parent,
  Context,
  MutationVerifyEmailArgs
>;
export interface MutationVerifyEmailArgs {
  token: string;
}

export type MutationResetPasswordResolver<
  R = Maybe<LoginResult>,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationResetPasswordArgs>;
export interface MutationResetPasswordArgs {
  token: string;

  newPassword: string;
}

export type MutationSendVerificationEmailResolver<
  R = Maybe<boolean>,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationSendVerificationEmailArgs>;
export interface MutationSendVerificationEmailArgs {
  email: string;
}

export type MutationSendResetPasswordEmailResolver<
  R = Maybe<boolean>,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationSendResetPasswordEmailArgs>;
export interface MutationSendResetPasswordEmailArgs {
  email: string;
}

export type MutationChangePasswordResolver<
  R = Maybe<boolean>,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationChangePasswordArgs>;
export interface MutationChangePasswordArgs {
  oldPassword: string;

  newPassword: string;
}

export type MutationTwoFactorSetResolver<R = Maybe<boolean>, Parent = {}, Context = {}> = Resolver<
  R,
  Parent,
  Context,
  MutationTwoFactorSetArgs
>;
export interface MutationTwoFactorSetArgs {
  secret: TwoFactorSecretKeyInput;

  code: string;
}

export type MutationTwoFactorUnsetResolver<
  R = Maybe<boolean>,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationTwoFactorUnsetArgs>;
export interface MutationTwoFactorUnsetArgs {
  code: string;
}

export type MutationImpersonateResolver<
  R = Maybe<ImpersonateReturn>,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationImpersonateArgs>;
export interface MutationImpersonateArgs {
  accessToken: string;

  username: string;
}

export type MutationRefreshTokensResolver<
  R = Maybe<LoginResult>,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationRefreshTokensArgs>;
export interface MutationRefreshTokensArgs {
  accessToken: string;

  refreshToken: string;
}

export type MutationLogoutResolver<R = Maybe<boolean>, Parent = {}, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;
export type MutationAuthenticateResolver<
  R = Maybe<LoginResult>,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationAuthenticateArgs>;
export interface MutationAuthenticateArgs {
  serviceName: string;

  params: AuthenticateParamsInput;
}

export interface LoginResultResolvers<Context = {}, TypeParent = LoginResult> {
  sessionId?: LoginResultSessionIdResolver<Maybe<string>, TypeParent, Context>;

  tokens?: LoginResultTokensResolver<Maybe<Tokens>, TypeParent, Context>;
}

export type LoginResultSessionIdResolver<
  R = Maybe<string>,
  Parent = LoginResult,
  Context = {}
> = Resolver<R, Parent, Context>;
export type LoginResultTokensResolver<
  R = Maybe<Tokens>,
  Parent = LoginResult,
  Context = {}
> = Resolver<R, Parent, Context>;

export interface TokensResolvers<Context = {}, TypeParent = Tokens> {
  refreshToken?: TokensRefreshTokenResolver<Maybe<string>, TypeParent, Context>;

  accessToken?: TokensAccessTokenResolver<Maybe<string>, TypeParent, Context>;
}

export type TokensRefreshTokenResolver<R = Maybe<string>, Parent = Tokens, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;
export type TokensAccessTokenResolver<R = Maybe<string>, Parent = Tokens, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;

export interface ImpersonateReturnResolvers<Context = {}, TypeParent = ImpersonateReturn> {
  authorized?: ImpersonateReturnAuthorizedResolver<Maybe<boolean>, TypeParent, Context>;

  tokens?: ImpersonateReturnTokensResolver<Maybe<Tokens>, TypeParent, Context>;

  user?: ImpersonateReturnUserResolver<Maybe<User>, TypeParent, Context>;
}

export type ImpersonateReturnAuthorizedResolver<
  R = Maybe<boolean>,
  Parent = ImpersonateReturn,
  Context = {}
> = Resolver<R, Parent, Context>;
export type ImpersonateReturnTokensResolver<
  R = Maybe<Tokens>,
  Parent = ImpersonateReturn,
  Context = {}
> = Resolver<R, Parent, Context>;
export type ImpersonateReturnUserResolver<
  R = Maybe<User>,
  Parent = ImpersonateReturn,
  Context = {}
> = Resolver<R, Parent, Context>;

export type AuthDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  {},
  {}
>; /** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<Result, SkipDirectiveArgs, {}>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  {}
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  {}
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface IResolvers<Context = {}> {
  Query?: QueryResolvers<Context>;
  TwoFactorSecretKey?: TwoFactorSecretKeyResolvers<Context>;
  User?: UserResolvers<Context>;
  EmailRecord?: EmailRecordResolvers<Context>;
  Mutation?: MutationResolvers<Context>;
  LoginResult?: LoginResultResolvers<Context>;
  Tokens?: TokensResolvers<Context>;
  ImpersonateReturn?: ImpersonateReturnResolvers<Context>;
}

export interface IDirectiveResolvers<Result> {
  auth?: AuthDirectiveResolver<Result>;
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
