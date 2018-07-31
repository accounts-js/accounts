/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql';

export type Resolver<Result, Args = any> = (
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

export namespace QueryResolvers {
  export interface Resolvers {
    getUser?: GetUserResolver;
    twoFactorSecret?: TwoFactorSecretResolver;
  }

  export type GetUserResolver<R = User | null> = Resolver<R>;

  export type TwoFactorSecretResolver<R = TwoFactorSecretKey | null> = Resolver<R>;
}

export namespace UserResolvers {
  export interface Resolvers {
    id?: IdResolver;
    emails?: EmailsResolver;
    username?: UsernameResolver;
  }

  export type IdResolver<R = string> = Resolver<R>;
  export type EmailsResolver<R = EmailRecord[] | null> = Resolver<R>;
  export type UsernameResolver<R = string | null> = Resolver<R>;
}

export namespace EmailRecordResolvers {
  export interface Resolvers {
    address?: AddressResolver;
    verified?: VerifiedResolver;
  }

  export type AddressResolver<R = string | null> = Resolver<R>;
  export type VerifiedResolver<R = boolean | null> = Resolver<R>;
}

export namespace TwoFactorSecretKeyResolvers {
  export interface Resolvers {
    ascii?: AsciiResolver;
    base32?: Base32Resolver;
    hex?: HexResolver;
    qr_code_ascii?: QrCodeAsciiResolver;
    qr_code_hex?: QrCodeHexResolver;
    qr_code_base32?: QrCodeBase32Resolver;
    google_auth_qr?: GoogleAuthQrResolver;
    otpauth_url?: OtpauthUrlResolver;
  }

  export type AsciiResolver<R = string | null> = Resolver<R>;
  export type Base32Resolver<R = string | null> = Resolver<R>;
  export type HexResolver<R = string | null> = Resolver<R>;
  export type QrCodeAsciiResolver<R = string | null> = Resolver<R>;
  export type QrCodeHexResolver<R = string | null> = Resolver<R>;
  export type QrCodeBase32Resolver<R = string | null> = Resolver<R>;
  export type GoogleAuthQrResolver<R = string | null> = Resolver<R>;
  export type OtpauthUrlResolver<R = string | null> = Resolver<R>;
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

  export type ImpersonateResolver<R = ImpersonateReturn | null> = Resolver<R, ImpersonateArgs>;
  export interface ImpersonateArgs {
    accessToken: string;
    username: string;
  }

  export type RefreshTokensResolver<R = LoginResult | null> = Resolver<R, RefreshTokensArgs>;
  export interface RefreshTokensArgs {
    accessToken: string;
    refreshToken: string;
  }

  export type LogoutResolver<R = boolean | null> = Resolver<R>;

  export type AuthenticateResolver<R = LoginResult | null> = Resolver<R, AuthenticateArgs>;
  export interface AuthenticateArgs {
    serviceName: string;
    params: AuthenticateParamsInput;
  }

  export type RegisterResolver<R = string | null> = Resolver<R, RegisterArgs>;
  export interface RegisterArgs {
    user: CreateUserInput;
  }

  export type VerifyEmailResolver<R = boolean | null> = Resolver<R, VerifyEmailArgs>;
  export interface VerifyEmailArgs {
    token: string;
  }

  export type ResetPasswordResolver<R = boolean | null> = Resolver<R, ResetPasswordArgs>;
  export interface ResetPasswordArgs {
    token: string;
    newPassword: string;
  }

  export type SendVerificationEmailResolver<R = boolean | null> = Resolver<
    R,
    SendVerificationEmailArgs
  >;
  export interface SendVerificationEmailArgs {
    email: string;
  }

  export type SendResetPasswordEmailResolver<R = boolean | null> = Resolver<
    R,
    SendResetPasswordEmailArgs
  >;
  export interface SendResetPasswordEmailArgs {
    email: string;
  }

  export type ChangePasswordResolver<R = boolean | null> = Resolver<R, ChangePasswordArgs>;
  export interface ChangePasswordArgs {
    oldPassword: string;
    newPassword: string;
  }

  export type TwoFactorSetResolver<R = boolean | null> = Resolver<R, TwoFactorSetArgs>;
  export interface TwoFactorSetArgs {
    secret: TwoFactorSecretKeyInput;
    code: string;
  }

  export type TwoFactorUnsetResolver<R = boolean | null> = Resolver<R, TwoFactorUnsetArgs>;
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

  export type AuthorizedResolver<R = boolean | null> = Resolver<R>;
  export type TokensResolver<R = Tokens | null> = Resolver<R>;
  export type UserResolver<R = User | null> = Resolver<R>;
}

export namespace TokensResolvers {
  export interface Resolvers {
    refreshToken?: RefreshTokenResolver;
    accessToken?: AccessTokenResolver;
  }

  export type RefreshTokenResolver<R = string | null> = Resolver<R>;
  export type AccessTokenResolver<R = string | null> = Resolver<R>;
}

export namespace LoginResultResolvers {
  export interface Resolvers {
    sessionId?: SessionIdResolver;
    tokens?: TokensResolver;
  }

  export type SessionIdResolver<R = string | null> = Resolver<R>;
  export type TokensResolver<R = Tokens | null> = Resolver<R>;
}
