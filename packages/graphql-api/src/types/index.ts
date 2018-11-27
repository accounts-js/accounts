/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql';

export type Resolver<Result, Parent = any, Context = any, Args = never> = (
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
  ): AsyncIterator<R | Result>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<Result, Parent = any, Context = any, Args = never> =
  | ((...args: any[]) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

// ====================================================
// START: Typescript template
// ====================================================

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
// InputTypes
// ====================================================

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

// ====================================================
// END: Typescript template
// ====================================================

// ====================================================
// Resolvers
// ====================================================

export namespace QueryResolvers {
  export interface Resolvers<Context = any, TypeParent = never> {
    twoFactorSecret?: TwoFactorSecretResolver<TwoFactorSecretKey | null, TypeParent, Context>;

    getUser?: GetUserResolver<User | null, TypeParent, Context>;
  }

  export type TwoFactorSecretResolver<
    R = TwoFactorSecretKey | null,
    Parent = never,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GetUserResolver<R = User | null, Parent = never, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace TwoFactorSecretKeyResolvers {
  export interface Resolvers<Context = any, TypeParent = TwoFactorSecretKey> {
    ascii?: AsciiResolver<string | null, TypeParent, Context>;

    base32?: Base32Resolver<string | null, TypeParent, Context>;

    hex?: HexResolver<string | null, TypeParent, Context>;

    qr_code_ascii?: QrCodeAsciiResolver<string | null, TypeParent, Context>;

    qr_code_hex?: QrCodeHexResolver<string | null, TypeParent, Context>;

    qr_code_base32?: QrCodeBase32Resolver<string | null, TypeParent, Context>;

    google_auth_qr?: GoogleAuthQrResolver<string | null, TypeParent, Context>;

    otpauth_url?: OtpauthUrlResolver<string | null, TypeParent, Context>;
  }

  export type AsciiResolver<
    R = string | null,
    Parent = TwoFactorSecretKey,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type Base32Resolver<
    R = string | null,
    Parent = TwoFactorSecretKey,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type HexResolver<R = string | null, Parent = TwoFactorSecretKey, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type QrCodeAsciiResolver<
    R = string | null,
    Parent = TwoFactorSecretKey,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type QrCodeHexResolver<
    R = string | null,
    Parent = TwoFactorSecretKey,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type QrCodeBase32Resolver<
    R = string | null,
    Parent = TwoFactorSecretKey,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type GoogleAuthQrResolver<
    R = string | null,
    Parent = TwoFactorSecretKey,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type OtpauthUrlResolver<
    R = string | null,
    Parent = TwoFactorSecretKey,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace UserResolvers {
  export interface Resolvers<Context = any, TypeParent = User> {
    id?: IdResolver<string, TypeParent, Context>;

    emails?: EmailsResolver<EmailRecord[] | null, TypeParent, Context>;

    username?: UsernameResolver<string | null, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = User, Context = any> = Resolver<R, Parent, Context>;
  export type EmailsResolver<R = EmailRecord[] | null, Parent = User, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UsernameResolver<R = string | null, Parent = User, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace EmailRecordResolvers {
  export interface Resolvers<Context = any, TypeParent = EmailRecord> {
    address?: AddressResolver<string | null, TypeParent, Context>;

    verified?: VerifiedResolver<boolean | null, TypeParent, Context>;
  }

  export type AddressResolver<R = string | null, Parent = EmailRecord, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type VerifiedResolver<R = boolean | null, Parent = EmailRecord, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = any, TypeParent = never> {
    createUser?: CreateUserResolver<string | null, TypeParent, Context>;

    verifyEmail?: VerifyEmailResolver<boolean | null, TypeParent, Context>;

    resetPassword?: ResetPasswordResolver<LoginResult | null, TypeParent, Context>;

    sendVerificationEmail?: SendVerificationEmailResolver<boolean | null, TypeParent, Context>;

    sendResetPasswordEmail?: SendResetPasswordEmailResolver<boolean | null, TypeParent, Context>;

    changePassword?: ChangePasswordResolver<boolean | null, TypeParent, Context>;

    twoFactorSet?: TwoFactorSetResolver<boolean | null, TypeParent, Context>;

    twoFactorUnset?: TwoFactorUnsetResolver<boolean | null, TypeParent, Context>;

    impersonate?: ImpersonateResolver<ImpersonateReturn | null, TypeParent, Context>;

    refreshTokens?: RefreshTokensResolver<LoginResult | null, TypeParent, Context>;

    logout?: LogoutResolver<boolean | null, TypeParent, Context>;

    authenticate?: AuthenticateResolver<LoginResult | null, TypeParent, Context>;
  }

  export type CreateUserResolver<R = string | null, Parent = never, Context = any> = Resolver<
    R,
    Parent,
    Context,
    CreateUserArgs
  >;
  export interface CreateUserArgs {
    user: CreateUserInput;
  }

  export type VerifyEmailResolver<R = boolean | null, Parent = never, Context = any> = Resolver<
    R,
    Parent,
    Context,
    VerifyEmailArgs
  >;
  export interface VerifyEmailArgs {
    token: string;
  }

  export type ResetPasswordResolver<
    R = LoginResult | null,
    Parent = never,
    Context = any
  > = Resolver<R, Parent, Context, ResetPasswordArgs>;
  export interface ResetPasswordArgs {
    token: string;

    newPassword: string;
  }

  export type SendVerificationEmailResolver<
    R = boolean | null,
    Parent = never,
    Context = any
  > = Resolver<R, Parent, Context, SendVerificationEmailArgs>;
  export interface SendVerificationEmailArgs {
    email: string;
  }

  export type SendResetPasswordEmailResolver<
    R = boolean | null,
    Parent = never,
    Context = any
  > = Resolver<R, Parent, Context, SendResetPasswordEmailArgs>;
  export interface SendResetPasswordEmailArgs {
    email: string;
  }

  export type ChangePasswordResolver<R = boolean | null, Parent = never, Context = any> = Resolver<
    R,
    Parent,
    Context,
    ChangePasswordArgs
  >;
  export interface ChangePasswordArgs {
    oldPassword: string;

    newPassword: string;
  }

  export type TwoFactorSetResolver<R = boolean | null, Parent = never, Context = any> = Resolver<
    R,
    Parent,
    Context,
    TwoFactorSetArgs
  >;
  export interface TwoFactorSetArgs {
    secret: TwoFactorSecretKeyInput;

    code: string;
  }

  export type TwoFactorUnsetResolver<R = boolean | null, Parent = never, Context = any> = Resolver<
    R,
    Parent,
    Context,
    TwoFactorUnsetArgs
  >;
  export interface TwoFactorUnsetArgs {
    code: string;
  }

  export type ImpersonateResolver<
    R = ImpersonateReturn | null,
    Parent = never,
    Context = any
  > = Resolver<R, Parent, Context, ImpersonateArgs>;
  export interface ImpersonateArgs {
    accessToken: string;

    username: string;
  }

  export type RefreshTokensResolver<
    R = LoginResult | null,
    Parent = never,
    Context = any
  > = Resolver<R, Parent, Context, RefreshTokensArgs>;
  export interface RefreshTokensArgs {
    accessToken: string;

    refreshToken: string;
  }

  export type LogoutResolver<R = boolean | null, Parent = never, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type AuthenticateResolver<
    R = LoginResult | null,
    Parent = never,
    Context = any
  > = Resolver<R, Parent, Context, AuthenticateArgs>;
  export interface AuthenticateArgs {
    serviceName: string;

    params: AuthenticateParamsInput;
  }
}

export namespace LoginResultResolvers {
  export interface Resolvers<Context = any, TypeParent = LoginResult> {
    sessionId?: SessionIdResolver<string | null, TypeParent, Context>;

    tokens?: TokensResolver<Tokens | null, TypeParent, Context>;
  }

  export type SessionIdResolver<R = string | null, Parent = LoginResult, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type TokensResolver<R = Tokens | null, Parent = LoginResult, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace TokensResolvers {
  export interface Resolvers<Context = any, TypeParent = Tokens> {
    refreshToken?: RefreshTokenResolver<string | null, TypeParent, Context>;

    accessToken?: AccessTokenResolver<string | null, TypeParent, Context>;
  }

  export type RefreshTokenResolver<R = string | null, Parent = Tokens, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type AccessTokenResolver<R = string | null, Parent = Tokens, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace ImpersonateReturnResolvers {
  export interface Resolvers<Context = any, TypeParent = ImpersonateReturn> {
    authorized?: AuthorizedResolver<boolean | null, TypeParent, Context>;

    tokens?: TokensResolver<Tokens | null, TypeParent, Context>;

    user?: UserResolver<User | null, TypeParent, Context>;
  }

  export type AuthorizedResolver<
    R = boolean | null,
    Parent = ImpersonateReturn,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TokensResolver<
    R = Tokens | null,
    Parent = ImpersonateReturn,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type UserResolver<R = User | null, Parent = ImpersonateReturn, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}
