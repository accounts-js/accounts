/* tslint:disable */

export interface CreateUserInput {
  username?: string | null;

  email?: string | null;

  password?: string | null;
}

export interface TwoFactorSecretKeyInput {
  ascii?: string | null;

  base32?: string | null;

  hex?: string | null;

  qr_code_ascii?: string | null;

  qr_code_hex?: string | null;

  qr_code_base32?: string | null;

  google_auth_qr?: string | null;

  otpauth_url?: string | null;
}

export interface AuthenticateParamsInput {
  access_token?: string | null;

  access_token_secret?: string | null;

  provider?: string | null;

  password?: string | null;

  user?: UserInput | null;

  code?: string | null;
}

export interface UserInput {
  id?: string | null;

  email?: string | null;

  username?: string | null;
}

// ====================================================
// Types
// ====================================================

export interface Query {
  twoFactorSecret?: TwoFactorSecretKey | null;

  getUser?: User | null;
}

export interface TwoFactorSecretKey {
  ascii?: string | null;

  base32?: string | null;

  hex?: string | null;

  qr_code_ascii?: string | null;

  qr_code_hex?: string | null;

  qr_code_base32?: string | null;

  google_auth_qr?: string | null;

  otpauth_url?: string | null;
}

export interface User {
  id: string;

  emails?: EmailRecord[] | null;

  username?: string | null;
}

export interface EmailRecord {
  address?: string | null;

  verified?: boolean | null;
}

export interface Mutation {
  createUser?: string | null;

  verifyEmail?: boolean | null;

  resetPassword?: LoginResult | null;

  sendVerificationEmail?: boolean | null;

  sendResetPasswordEmail?: boolean | null;

  changePassword?: boolean | null;

  twoFactorSet?: boolean | null;

  twoFactorUnset?: boolean | null;

  impersonate?: ImpersonateReturn | null;

  refreshTokens?: LoginResult | null;

  logout?: boolean | null;

  authenticate?: LoginResult | null;
}

export interface LoginResult {
  sessionId?: string | null;

  tokens?: Tokens | null;
}

export interface Tokens {
  refreshToken?: string | null;

  accessToken?: string | null;
}

export interface ImpersonateReturn {
  authorized?: boolean | null;

  tokens?: Tokens | null;

  user?: User | null;
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

import { GraphQLResolveInfo, GraphQLScalarTypeConfig } from 'graphql';

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

type Maybe<T> = T | null | undefined;

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
  twoFactorSecret?: QueryTwoFactorSecretResolver<TwoFactorSecretKey | null, TypeParent, Context>;

  getUser?: QueryGetUserResolver<User | null, TypeParent, Context>;
}

export type QueryTwoFactorSecretResolver<
  R = TwoFactorSecretKey | null,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context>;
export type QueryGetUserResolver<R = User | null, Parent = {}, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;

export interface TwoFactorSecretKeyResolvers<Context = {}, TypeParent = TwoFactorSecretKey> {
  ascii?: TwoFactorSecretKeyAsciiResolver<string | null, TypeParent, Context>;

  base32?: TwoFactorSecretKeyBase32Resolver<string | null, TypeParent, Context>;

  hex?: TwoFactorSecretKeyHexResolver<string | null, TypeParent, Context>;

  qr_code_ascii?: TwoFactorSecretKeyQrCodeAsciiResolver<string | null, TypeParent, Context>;

  qr_code_hex?: TwoFactorSecretKeyQrCodeHexResolver<string | null, TypeParent, Context>;

  qr_code_base32?: TwoFactorSecretKeyQrCodeBase32Resolver<string | null, TypeParent, Context>;

  google_auth_qr?: TwoFactorSecretKeyGoogleAuthQrResolver<string | null, TypeParent, Context>;

  otpauth_url?: TwoFactorSecretKeyOtpauthUrlResolver<string | null, TypeParent, Context>;
}

export type TwoFactorSecretKeyAsciiResolver<
  R = string | null,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyBase32Resolver<
  R = string | null,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyHexResolver<
  R = string | null,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyQrCodeAsciiResolver<
  R = string | null,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyQrCodeHexResolver<
  R = string | null,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyQrCodeBase32Resolver<
  R = string | null,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyGoogleAuthQrResolver<
  R = string | null,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;
export type TwoFactorSecretKeyOtpauthUrlResolver<
  R = string | null,
  Parent = TwoFactorSecretKey,
  Context = {}
> = Resolver<R, Parent, Context>;

export interface UserResolvers<Context = {}, TypeParent = User> {
  id?: UserIdResolver<string, TypeParent, Context>;

  emails?: UserEmailsResolver<EmailRecord[] | null, TypeParent, Context>;

  username?: UserUsernameResolver<string | null, TypeParent, Context>;
}

export type UserIdResolver<R = string, Parent = User, Context = {}> = Resolver<R, Parent, Context>;
export type UserEmailsResolver<R = EmailRecord[] | null, Parent = User, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;
export type UserUsernameResolver<R = string | null, Parent = User, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;

export interface EmailRecordResolvers<Context = {}, TypeParent = EmailRecord> {
  address?: EmailRecordAddressResolver<string | null, TypeParent, Context>;

  verified?: EmailRecordVerifiedResolver<boolean | null, TypeParent, Context>;
}

export type EmailRecordAddressResolver<
  R = string | null,
  Parent = EmailRecord,
  Context = {}
> = Resolver<R, Parent, Context>;
export type EmailRecordVerifiedResolver<
  R = boolean | null,
  Parent = EmailRecord,
  Context = {}
> = Resolver<R, Parent, Context>;

export interface MutationResolvers<Context = {}, TypeParent = {}> {
  createUser?: MutationCreateUserResolver<string | null, TypeParent, Context>;

  verifyEmail?: MutationVerifyEmailResolver<boolean | null, TypeParent, Context>;

  resetPassword?: MutationResetPasswordResolver<LoginResult | null, TypeParent, Context>;

  sendVerificationEmail?: MutationSendVerificationEmailResolver<
    boolean | null,
    TypeParent,
    Context
  >;

  sendResetPasswordEmail?: MutationSendResetPasswordEmailResolver<
    boolean | null,
    TypeParent,
    Context
  >;

  changePassword?: MutationChangePasswordResolver<boolean | null, TypeParent, Context>;

  twoFactorSet?: MutationTwoFactorSetResolver<boolean | null, TypeParent, Context>;

  twoFactorUnset?: MutationTwoFactorUnsetResolver<boolean | null, TypeParent, Context>;

  impersonate?: MutationImpersonateResolver<ImpersonateReturn | null, TypeParent, Context>;

  refreshTokens?: MutationRefreshTokensResolver<LoginResult | null, TypeParent, Context>;

  logout?: MutationLogoutResolver<boolean | null, TypeParent, Context>;

  authenticate?: MutationAuthenticateResolver<LoginResult | null, TypeParent, Context>;
}

export type MutationCreateUserResolver<R = string | null, Parent = {}, Context = {}> = Resolver<
  R,
  Parent,
  Context,
  MutationCreateUserArgs
>;
export interface MutationCreateUserArgs {
  user: CreateUserInput;
}

export type MutationVerifyEmailResolver<R = boolean | null, Parent = {}, Context = {}> = Resolver<
  R,
  Parent,
  Context,
  MutationVerifyEmailArgs
>;
export interface MutationVerifyEmailArgs {
  token: string;
}

export type MutationResetPasswordResolver<
  R = LoginResult | null,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationResetPasswordArgs>;
export interface MutationResetPasswordArgs {
  token: string;

  newPassword: string;
}

export type MutationSendVerificationEmailResolver<
  R = boolean | null,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationSendVerificationEmailArgs>;
export interface MutationSendVerificationEmailArgs {
  email: string;
}

export type MutationSendResetPasswordEmailResolver<
  R = boolean | null,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationSendResetPasswordEmailArgs>;
export interface MutationSendResetPasswordEmailArgs {
  email: string;
}

export type MutationChangePasswordResolver<
  R = boolean | null,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationChangePasswordArgs>;
export interface MutationChangePasswordArgs {
  oldPassword: string;

  newPassword: string;
}

export type MutationTwoFactorSetResolver<R = boolean | null, Parent = {}, Context = {}> = Resolver<
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
  R = boolean | null,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationTwoFactorUnsetArgs>;
export interface MutationTwoFactorUnsetArgs {
  code: string;
}

export type MutationImpersonateResolver<
  R = ImpersonateReturn | null,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationImpersonateArgs>;
export interface MutationImpersonateArgs {
  accessToken: string;

  username: string;
}

export type MutationRefreshTokensResolver<
  R = LoginResult | null,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationRefreshTokensArgs>;
export interface MutationRefreshTokensArgs {
  accessToken: string;

  refreshToken: string;
}

export type MutationLogoutResolver<R = boolean | null, Parent = {}, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;
export type MutationAuthenticateResolver<
  R = LoginResult | null,
  Parent = {},
  Context = {}
> = Resolver<R, Parent, Context, MutationAuthenticateArgs>;
export interface MutationAuthenticateArgs {
  serviceName: string;

  params: AuthenticateParamsInput;
}

export interface LoginResultResolvers<Context = {}, TypeParent = LoginResult> {
  sessionId?: LoginResultSessionIdResolver<string | null, TypeParent, Context>;

  tokens?: LoginResultTokensResolver<Tokens | null, TypeParent, Context>;
}

export type LoginResultSessionIdResolver<
  R = string | null,
  Parent = LoginResult,
  Context = {}
> = Resolver<R, Parent, Context>;
export type LoginResultTokensResolver<
  R = Tokens | null,
  Parent = LoginResult,
  Context = {}
> = Resolver<R, Parent, Context>;

export interface TokensResolvers<Context = {}, TypeParent = Tokens> {
  refreshToken?: TokensRefreshTokenResolver<string | null, TypeParent, Context>;

  accessToken?: TokensAccessTokenResolver<string | null, TypeParent, Context>;
}

export type TokensRefreshTokenResolver<R = string | null, Parent = Tokens, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;
export type TokensAccessTokenResolver<R = string | null, Parent = Tokens, Context = {}> = Resolver<
  R,
  Parent,
  Context
>;

export interface ImpersonateReturnResolvers<Context = {}, TypeParent = ImpersonateReturn> {
  authorized?: ImpersonateReturnAuthorizedResolver<boolean | null, TypeParent, Context>;

  tokens?: ImpersonateReturnTokensResolver<Tokens | null, TypeParent, Context>;

  user?: ImpersonateReturnUserResolver<User | null, TypeParent, Context>;
}

export type ImpersonateReturnAuthorizedResolver<
  R = boolean | null,
  Parent = ImpersonateReturn,
  Context = {}
> = Resolver<R, Parent, Context>;
export type ImpersonateReturnTokensResolver<
  R = Tokens | null,
  Parent = ImpersonateReturn,
  Context = {}
> = Resolver<R, Parent, Context>;
export type ImpersonateReturnUserResolver<
  R = User | null,
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
  reason?: string | null;
}
