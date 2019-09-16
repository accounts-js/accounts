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

  authenticate?: Maybe<LoginWithServiceResult>;

  verifyAuthentication?: Maybe<boolean>;

  performMfaChallenge?: Maybe<string>;
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

export interface MfaLoginResult {
  mfaToken?: Maybe<string>;

  challenges?: Maybe<(Maybe<string>)[]>;
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
export interface VerifyAuthenticationMutationArgs {
  serviceName: string;

  params: AuthenticateParamsInput;
}
export interface PerformMfaChallengeMutationArgs {
  challenge: string;

  mfaToken: string;

  params: AuthenticateParamsInput;
}

// ====================================================
// Unions
// ====================================================

export type LoginWithServiceResult = LoginResult | MfaLoginResult;

import { GraphQLResolveInfo } from 'graphql';

export type Resolver<Result, Parent = {}, TContext = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, TContext, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<Result, Parent = {}, TContext = {}, Args = {}> =
  | ((...args: any[]) => ISubscriptionResolverObject<Result, Parent, TContext, Args>)
  | ISubscriptionResolverObject<Result, Parent, TContext, Args>;

export type TypeResolveFn<Types, Parent = {}, TContext = {}> = (
  parent: Parent,
  context: TContext,
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

export interface QueryResolvers<TContext = {}, TypeParent = {}> {
  twoFactorSecret?: QueryTwoFactorSecretResolver<Maybe<TwoFactorSecretKey>, TypeParent, TContext>;

  getUser?: QueryGetUserResolver<Maybe<User>, TypeParent, TContext>;
}

export type QueryTwoFactorSecretResolver<
  R = Maybe<TwoFactorSecretKey>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type QueryGetUserResolver<R = Maybe<User>, Parent = {}, TContext = {}> = Resolver<
  R,
  Parent,
  TContext
>;

export interface TwoFactorSecretKeyResolvers<TContext = {}, TypeParent = TwoFactorSecretKey> {
  ascii?: TwoFactorSecretKeyAsciiResolver<Maybe<string>, TypeParent, TContext>;

  base32?: TwoFactorSecretKeyBase32Resolver<Maybe<string>, TypeParent, TContext>;

  hex?: TwoFactorSecretKeyHexResolver<Maybe<string>, TypeParent, TContext>;

  qr_code_ascii?: TwoFactorSecretKeyQrCodeAsciiResolver<Maybe<string>, TypeParent, TContext>;

  qr_code_hex?: TwoFactorSecretKeyQrCodeHexResolver<Maybe<string>, TypeParent, TContext>;

  qr_code_base32?: TwoFactorSecretKeyQrCodeBase32Resolver<Maybe<string>, TypeParent, TContext>;

  google_auth_qr?: TwoFactorSecretKeyGoogleAuthQrResolver<Maybe<string>, TypeParent, TContext>;

  otpauth_url?: TwoFactorSecretKeyOtpauthUrlResolver<Maybe<string>, TypeParent, TContext>;
}

export type TwoFactorSecretKeyAsciiResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type TwoFactorSecretKeyBase32Resolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type TwoFactorSecretKeyHexResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type TwoFactorSecretKeyQrCodeAsciiResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type TwoFactorSecretKeyQrCodeHexResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type TwoFactorSecretKeyQrCodeBase32Resolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type TwoFactorSecretKeyGoogleAuthQrResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type TwoFactorSecretKeyOtpauthUrlResolver<
  R = Maybe<string>,
  Parent = TwoFactorSecretKey,
  TContext = {}
> = Resolver<R, Parent, TContext>;

export interface UserResolvers<TContext = {}, TypeParent = User> {
  id?: UserIdResolver<string, TypeParent, TContext>;

  emails?: UserEmailsResolver<Maybe<EmailRecord[]>, TypeParent, TContext>;

  username?: UserUsernameResolver<Maybe<string>, TypeParent, TContext>;
}

export type UserIdResolver<R = string, Parent = User, TContext = {}> = Resolver<
  R,
  Parent,
  TContext
>;
export type UserEmailsResolver<R = Maybe<EmailRecord[]>, Parent = User, TContext = {}> = Resolver<
  R,
  Parent,
  TContext
>;
export type UserUsernameResolver<R = Maybe<string>, Parent = User, TContext = {}> = Resolver<
  R,
  Parent,
  TContext
>;

export interface EmailRecordResolvers<TContext = {}, TypeParent = EmailRecord> {
  address?: EmailRecordAddressResolver<Maybe<string>, TypeParent, TContext>;

  verified?: EmailRecordVerifiedResolver<Maybe<boolean>, TypeParent, TContext>;
}

export type EmailRecordAddressResolver<
  R = Maybe<string>,
  Parent = EmailRecord,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type EmailRecordVerifiedResolver<
  R = Maybe<boolean>,
  Parent = EmailRecord,
  TContext = {}
> = Resolver<R, Parent, TContext>;

export interface MutationResolvers<TContext = {}, TypeParent = {}> {
  createUser?: MutationCreateUserResolver<Maybe<string>, TypeParent, TContext>;

  verifyEmail?: MutationVerifyEmailResolver<Maybe<boolean>, TypeParent, TContext>;

  resetPassword?: MutationResetPasswordResolver<Maybe<LoginResult>, TypeParent, TContext>;

  sendVerificationEmail?: MutationSendVerificationEmailResolver<
    Maybe<boolean>,
    TypeParent,
    TContext
  >;

  sendResetPasswordEmail?: MutationSendResetPasswordEmailResolver<
    Maybe<boolean>,
    TypeParent,
    TContext
  >;

  changePassword?: MutationChangePasswordResolver<Maybe<boolean>, TypeParent, TContext>;

  twoFactorSet?: MutationTwoFactorSetResolver<Maybe<boolean>, TypeParent, TContext>;

  twoFactorUnset?: MutationTwoFactorUnsetResolver<Maybe<boolean>, TypeParent, TContext>;

  impersonate?: MutationImpersonateResolver<Maybe<ImpersonateReturn>, TypeParent, TContext>;

  refreshTokens?: MutationRefreshTokensResolver<Maybe<LoginResult>, TypeParent, TContext>;

  logout?: MutationLogoutResolver<Maybe<boolean>, TypeParent, TContext>;

  authenticate?: MutationAuthenticateResolver<Maybe<LoginWithServiceResult>, TypeParent, TContext>;

  verifyAuthentication?: MutationVerifyAuthenticationResolver<Maybe<boolean>, TypeParent, TContext>;

  performMfaChallenge?: MutationPerformMfaChallengeResolver<Maybe<string>, TypeParent, TContext>;
}

export type MutationCreateUserResolver<R = Maybe<string>, Parent = {}, TContext = {}> = Resolver<
  R,
  Parent,
  TContext,
  MutationCreateUserArgs
>;
export interface MutationCreateUserArgs {
  user: CreateUserInput;
}

export type MutationVerifyEmailResolver<R = Maybe<boolean>, Parent = {}, TContext = {}> = Resolver<
  R,
  Parent,
  TContext,
  MutationVerifyEmailArgs
>;
export interface MutationVerifyEmailArgs {
  token: string;
}

export type MutationResetPasswordResolver<
  R = Maybe<LoginResult>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext, MutationResetPasswordArgs>;
export interface MutationResetPasswordArgs {
  token: string;

  newPassword: string;
}

export type MutationSendVerificationEmailResolver<
  R = Maybe<boolean>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext, MutationSendVerificationEmailArgs>;
export interface MutationSendVerificationEmailArgs {
  email: string;
}

export type MutationSendResetPasswordEmailResolver<
  R = Maybe<boolean>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext, MutationSendResetPasswordEmailArgs>;
export interface MutationSendResetPasswordEmailArgs {
  email: string;
}

export type MutationChangePasswordResolver<
  R = Maybe<boolean>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext, MutationChangePasswordArgs>;
export interface MutationChangePasswordArgs {
  oldPassword: string;

  newPassword: string;
}

export type MutationTwoFactorSetResolver<R = Maybe<boolean>, Parent = {}, TContext = {}> = Resolver<
  R,
  Parent,
  TContext,
  MutationTwoFactorSetArgs
>;
export interface MutationTwoFactorSetArgs {
  secret: TwoFactorSecretKeyInput;

  code: string;
}

export type MutationTwoFactorUnsetResolver<
  R = Maybe<boolean>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext, MutationTwoFactorUnsetArgs>;
export interface MutationTwoFactorUnsetArgs {
  code: string;
}

export type MutationImpersonateResolver<
  R = Maybe<ImpersonateReturn>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext, MutationImpersonateArgs>;
export interface MutationImpersonateArgs {
  accessToken: string;

  username: string;
}

export type MutationRefreshTokensResolver<
  R = Maybe<LoginResult>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext, MutationRefreshTokensArgs>;
export interface MutationRefreshTokensArgs {
  accessToken: string;

  refreshToken: string;
}

export type MutationLogoutResolver<R = Maybe<boolean>, Parent = {}, TContext = {}> = Resolver<
  R,
  Parent,
  TContext
>;
export type MutationAuthenticateResolver<
  R = Maybe<LoginWithServiceResult>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext, MutationAuthenticateArgs>;
export interface MutationAuthenticateArgs {
  serviceName: string;

  params: AuthenticateParamsInput;
}

export type MutationVerifyAuthenticationResolver<
  R = Maybe<boolean>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext, MutationVerifyAuthenticationArgs>;
export interface MutationVerifyAuthenticationArgs {
  serviceName: string;

  params: AuthenticateParamsInput;
}

export type MutationPerformMfaChallengeResolver<
  R = Maybe<string>,
  Parent = {},
  TContext = {}
> = Resolver<R, Parent, TContext, MutationPerformMfaChallengeArgs>;
export interface MutationPerformMfaChallengeArgs {
  challenge: string;

  mfaToken: string;

  params: AuthenticateParamsInput;
}

export interface LoginResultResolvers<TContext = {}, TypeParent = LoginResult> {
  sessionId?: LoginResultSessionIdResolver<Maybe<string>, TypeParent, TContext>;

  tokens?: LoginResultTokensResolver<Maybe<Tokens>, TypeParent, TContext>;
}

export type LoginResultSessionIdResolver<
  R = Maybe<string>,
  Parent = LoginResult,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type LoginResultTokensResolver<
  R = Maybe<Tokens>,
  Parent = LoginResult,
  TContext = {}
> = Resolver<R, Parent, TContext>;

export interface TokensResolvers<TContext = {}, TypeParent = Tokens> {
  refreshToken?: TokensRefreshTokenResolver<Maybe<string>, TypeParent, TContext>;

  accessToken?: TokensAccessTokenResolver<Maybe<string>, TypeParent, TContext>;
}

export type TokensRefreshTokenResolver<
  R = Maybe<string>,
  Parent = Tokens,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type TokensAccessTokenResolver<R = Maybe<string>, Parent = Tokens, TContext = {}> = Resolver<
  R,
  Parent,
  TContext
>;

export interface ImpersonateReturnResolvers<TContext = {}, TypeParent = ImpersonateReturn> {
  authorized?: ImpersonateReturnAuthorizedResolver<Maybe<boolean>, TypeParent, TContext>;

  tokens?: ImpersonateReturnTokensResolver<Maybe<Tokens>, TypeParent, TContext>;

  user?: ImpersonateReturnUserResolver<Maybe<User>, TypeParent, TContext>;
}

export type ImpersonateReturnAuthorizedResolver<
  R = Maybe<boolean>,
  Parent = ImpersonateReturn,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type ImpersonateReturnTokensResolver<
  R = Maybe<Tokens>,
  Parent = ImpersonateReturn,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type ImpersonateReturnUserResolver<
  R = Maybe<User>,
  Parent = ImpersonateReturn,
  TContext = {}
> = Resolver<R, Parent, TContext>;

export interface MfaLoginResultResolvers<TContext = {}, TypeParent = MfaLoginResult> {
  mfaToken?: MfaLoginResultMfaTokenResolver<Maybe<string>, TypeParent, TContext>;

  challenges?: MfaLoginResultChallengesResolver<Maybe<(Maybe<string>)[]>, TypeParent, TContext>;
}

export type MfaLoginResultMfaTokenResolver<
  R = Maybe<string>,
  Parent = MfaLoginResult,
  TContext = {}
> = Resolver<R, Parent, TContext>;
export type MfaLoginResultChallengesResolver<
  R = Maybe<(Maybe<string>)[]>,
  Parent = MfaLoginResult,
  TContext = {}
> = Resolver<R, Parent, TContext>;

export interface LoginWithServiceResultResolvers {
  __resolveType: LoginWithServiceResultResolveType;
}
export type LoginWithServiceResultResolveType<
  R = 'LoginResult' | 'MFALoginResult',
  Parent = LoginResult | MfaLoginResult,
  TContext = {}
> = TypeResolveFn<R, Parent, TContext>;

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

export type IResolvers<TContext = {}> = {
  Query?: QueryResolvers<TContext>;
  TwoFactorSecretKey?: TwoFactorSecretKeyResolvers<TContext>;
  User?: UserResolvers<TContext>;
  EmailRecord?: EmailRecordResolvers<TContext>;
  Mutation?: MutationResolvers<TContext>;
  LoginResult?: LoginResultResolvers<TContext>;
  Tokens?: TokensResolvers<TContext>;
  ImpersonateReturn?: ImpersonateReturnResolvers<TContext>;
  MfaLoginResult?: MfaLoginResultResolvers<TContext>;
  LoginWithServiceResult?: LoginWithServiceResultResolvers;
} & { [typeName: string]: never };

export type IDirectiveResolvers<Result> = {
  auth?: AuthDirectiveResolver<Result>;
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
} & { [directiveName: string]: never };
