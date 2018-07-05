/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql';

type Resolver<Result, Args = any> = (
  parent: any,
  args: Args,
  context: any,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface Query {
  getUser?: User | null;
  twoFactorSecret?: TwoFactorSecretKey | null;
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

export interface Mutation {
  impersonate?: ImpersonateReturn | null;
  refreshTokens?: LoginResult | null;
  logout?: boolean | null;
  authenticate?: LoginResult | null /** Example: Login with passwordauthenticate(serviceName: "password", params: {password: "<pw>", user: {email: "<email>"}}) */;
  register?:
    | string
    | null /** register returns the id corresponding db ids, such as number IDs, ObjectIDs or UUIDs */;
  verifyEmail?: boolean | null;
  resetPassword?: boolean | null;
  sendVerificationEmail?: boolean | null;
  sendResetPasswordEmail?: boolean | null;
  changePassword?: boolean | null;
  twoFactorSet?: boolean | null;
  twoFactorUnset?: boolean | null;
}

export interface ImpersonateReturn {
  authorized?: boolean | null;
  tokens?: Tokens | null;
  user?: User | null;
}

export interface Tokens {
  refreshToken?: string | null;
  accessToken?: string | null;
}

export interface LoginResult {
  sessionId?: string | null;
  tokens?: Tokens | null;
}

export namespace QueryResolvers {
  export interface Resolvers {
    getUser?: GetUserResolver;
    twoFactorSecret?: TwoFactorSecretResolver;
  }

  export type GetUserResolver = Resolver<User | null, GetUserArgs>;
  export interface GetUserArgs {
    accessToken: string;
  }

  export type TwoFactorSecretResolver = Resolver<TwoFactorSecretKey | null>;
}

export namespace UserResolvers {
  export interface Resolvers {
    id?: IdResolver;
    emails?: EmailsResolver;
    username?: UsernameResolver;
  }

  export type IdResolver = Resolver<string>;
  export type EmailsResolver = Resolver<EmailRecord[] | null>;
  export type UsernameResolver = Resolver<string | null>;
}

export namespace EmailRecordResolvers {
  export interface Resolvers {
    address?: AddressResolver;
    verified?: VerifiedResolver;
  }

  export type AddressResolver = Resolver<string | null>;
  export type VerifiedResolver = Resolver<boolean | null>;
}

export namespace TwoFactorSecretKeyResolvers {
  export interface Resolvers {
    ascii?: AsciiResolver;
    base32?: Base32Resolver;
    hex?: HexResolver;
    qr_code_ascii?: Qr_code_asciiResolver;
    qr_code_hex?: Qr_code_hexResolver;
    qr_code_base32?: Qr_code_base32Resolver;
    google_auth_qr?: Google_auth_qrResolver;
    otpauth_url?: Otpauth_urlResolver;
  }

  export type AsciiResolver = Resolver<string | null>;
  export type Base32Resolver = Resolver<string | null>;
  export type HexResolver = Resolver<string | null>;
  export type Qr_code_asciiResolver = Resolver<string | null>;
  export type Qr_code_hexResolver = Resolver<string | null>;
  export type Qr_code_base32Resolver = Resolver<string | null>;
  export type Google_auth_qrResolver = Resolver<string | null>;
  export type Otpauth_urlResolver = Resolver<string | null>;
}

export namespace MutationResolvers {
  export interface Resolvers {
    impersonate?: ImpersonateResolver;
    refreshTokens?: RefreshTokensResolver;
    logout?: LogoutResolver;
    authenticate?: AuthenticateResolver /** Example: Login with passwordauthenticate(serviceName: "password", params: {password: "<pw>", user: {email: "<email>"}}) */;
    register?: RegisterResolver /** register returns the id corresponding db ids, such as number IDs, ObjectIDs or UUIDs */;
    verifyEmail?: VerifyEmailResolver;
    resetPassword?: ResetPasswordResolver;
    sendVerificationEmail?: SendVerificationEmailResolver;
    sendResetPasswordEmail?: SendResetPasswordEmailResolver;
    changePassword?: ChangePasswordResolver;
    twoFactorSet?: TwoFactorSetResolver;
    twoFactorUnset?: TwoFactorUnsetResolver;
  }

  export type ImpersonateResolver = Resolver<ImpersonateReturn | null, ImpersonateArgs>;
  export interface ImpersonateArgs {
    accessToken: string;
    username: string;
  }

  export type RefreshTokensResolver = Resolver<LoginResult | null, RefreshTokensArgs>;
  export interface RefreshTokensArgs {
    accessToken: string;
    refreshToken: string;
  }

  export type LogoutResolver = Resolver<boolean | null, LogoutArgs>;
  export interface LogoutArgs {
    accessToken: string;
  }

  export type AuthenticateResolver = Resolver<LoginResult | null, AuthenticateArgs>;
  export interface AuthenticateArgs {
    serviceName: string;
    params: AuthenticateParamsInput;
  }

  export type RegisterResolver = Resolver<string | null, RegisterArgs>;
  export interface RegisterArgs {
    user: CreateUserInput;
  }

  export type VerifyEmailResolver = Resolver<boolean | null, VerifyEmailArgs>;
  export interface VerifyEmailArgs {
    token: string;
  }

  export type ResetPasswordResolver = Resolver<boolean | null, ResetPasswordArgs>;
  export interface ResetPasswordArgs {
    token: string;
    newPassword: string;
  }

  export type SendVerificationEmailResolver = Resolver<boolean | null, SendVerificationEmailArgs>;
  export interface SendVerificationEmailArgs {
    email: string;
  }

  export type SendResetPasswordEmailResolver = Resolver<boolean | null, SendResetPasswordEmailArgs>;
  export interface SendResetPasswordEmailArgs {
    email: string;
  }

  export type ChangePasswordResolver = Resolver<boolean | null, ChangePasswordArgs>;
  export interface ChangePasswordArgs {
    oldPassword: string;
    newPassword: string;
  }

  export type TwoFactorSetResolver = Resolver<boolean | null, TwoFactorSetArgs>;
  export interface TwoFactorSetArgs {
    secret: TwoFactorSecretKeyInput;
    code: string;
  }

  export type TwoFactorUnsetResolver = Resolver<boolean | null, TwoFactorUnsetArgs>;
  export interface TwoFactorUnsetArgs {
    code: string;
  }
}

export namespace ImpersonateReturnResolvers {
  export interface Resolvers {
    authorized?: AuthorizedResolver;
    tokens?: TokensResolver;
    user?: UserResolver;
  }

  export type AuthorizedResolver = Resolver<boolean | null>;
  export type TokensResolver = Resolver<Tokens | null>;
  export type UserResolver = Resolver<User | null>;
}

export namespace TokensResolvers {
  export interface Resolvers {
    refreshToken?: RefreshTokenResolver;
    accessToken?: AccessTokenResolver;
  }

  export type RefreshTokenResolver = Resolver<string | null>;
  export type AccessTokenResolver = Resolver<string | null>;
}

export namespace LoginResultResolvers {
  export interface Resolvers {
    sessionId?: SessionIdResolver;
    tokens?: TokensResolver;
  }

  export type SessionIdResolver = Resolver<string | null>;
  export type TokensResolver = Resolver<Tokens | null>;
}

export interface AuthenticateParamsInput {
  access_token?: string | null /** Twitter, Instagram */;
  access_token_secret?: string | null /** Twitter */;
  provider?: string | null /** OAuth */;
  password?: string | null /** Password */;
  user?: UserInput | null /** Password */;
  code?: string | null /** Two factor */;
}

export interface UserInput {
  id?: string | null;
  email?: string | null;
  username?: string | null;
}

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
export interface GetUserQueryArgs {
  accessToken: string;
}
export interface ImpersonateMutationArgs {
  accessToken: string;
  username: string;
}
export interface RefreshTokensMutationArgs {
  accessToken: string;
  refreshToken: string;
}
export interface LogoutMutationArgs {
  accessToken: string;
}
export interface AuthenticateMutationArgs {
  serviceName: string;
  params: AuthenticateParamsInput;
}
export interface RegisterMutationArgs {
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
