/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql';

export type Resolver<Result, Parent = any, Context = any, Args = any> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export type SubscriptionResolver<Result, Parent = any, Context = any, Args = any> = {
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
};

export interface Service {
  name: string;
}

export interface Query {
  getUser?: User | null;
  getAccountsOptions?: AccountsOptions | null;
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

export interface AccountsOptions {
  services?: (Service | null)[] | null;
  siteTitle?: string | null;
  siteUrl?: string | null;
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
  createUser?:
    | string
    | null /** Creates a user with a password, returns the id corresponding db ids, such as number IDs, ObjectIDs or UUIDs */;
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

export interface PasswordService {
  name: string;
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

export namespace QueryResolvers {
  export interface Resolvers<Context = any> {
    getUser?: GetUserResolver<User | null, any, Context>;
    getAccountsOptions?: GetAccountsOptionsResolver<AccountsOptions | null, any, Context>;
    twoFactorSecret?: TwoFactorSecretResolver<TwoFactorSecretKey | null, any, Context>;
  }

  export type GetUserResolver<R = User | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type GetAccountsOptionsResolver<
    R = AccountsOptions | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type TwoFactorSecretResolver<
    R = TwoFactorSecretKey | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
}

export namespace UserResolvers {
  export interface Resolvers<Context = any> {
    id?: IdResolver<string, any, Context>;
    emails?: EmailsResolver<EmailRecord[] | null, any, Context>;
    username?: UsernameResolver<string | null, any, Context>;
  }

  export type IdResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
  export type EmailsResolver<R = EmailRecord[] | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UsernameResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace EmailRecordResolvers {
  export interface Resolvers<Context = any> {
    address?: AddressResolver<string | null, any, Context>;
    verified?: VerifiedResolver<boolean | null, any, Context>;
  }

  export type AddressResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type VerifiedResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace AccountsOptionsResolvers {
  export interface Resolvers<Context = any> {
    services?: ServicesResolver<(Service | null)[] | null, any, Context>;
    siteTitle?: SiteTitleResolver<string | null, any, Context>;
    siteUrl?: SiteUrlResolver<string | null, any, Context>;
  }

  export type ServicesResolver<
    R = (Service | null)[] | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context>;
  export type SiteTitleResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type SiteUrlResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace TwoFactorSecretKeyResolvers {
  export interface Resolvers<Context = any> {
    ascii?: AsciiResolver<string | null, any, Context>;
    base32?: Base32Resolver<string | null, any, Context>;
    hex?: HexResolver<string | null, any, Context>;
    qr_code_ascii?: QrCodeAsciiResolver<string | null, any, Context>;
    qr_code_hex?: QrCodeHexResolver<string | null, any, Context>;
    qr_code_base32?: QrCodeBase32Resolver<string | null, any, Context>;
    google_auth_qr?: GoogleAuthQrResolver<string | null, any, Context>;
    otpauth_url?: OtpauthUrlResolver<string | null, any, Context>;
  }

  export type AsciiResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type Base32Resolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type HexResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type QrCodeAsciiResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type QrCodeHexResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type QrCodeBase32Resolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type GoogleAuthQrResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type OtpauthUrlResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = any> {
    impersonate?: ImpersonateResolver<ImpersonateReturn | null, any, Context>;
    refreshTokens?: RefreshTokensResolver<LoginResult | null, any, Context>;
    logout?: LogoutResolver<boolean | null, any, Context>;
    authenticate?: AuthenticateResolver<
      LoginResult | null,
      any,
      Context
    > /** Example: Login with passwordauthenticate(serviceName: "password", params: {password: "<pw>", user: {email: "<email>"}}) */;
    createUser?: CreateUserResolver<
      string | null,
      any,
      Context
    > /** Creates a user with a password, returns the id corresponding db ids, such as number IDs, ObjectIDs or UUIDs */;
    verifyEmail?: VerifyEmailResolver<boolean | null, any, Context>;
    resetPassword?: ResetPasswordResolver<boolean | null, any, Context>;
    sendVerificationEmail?: SendVerificationEmailResolver<boolean | null, any, Context>;
    sendResetPasswordEmail?: SendResetPasswordEmailResolver<boolean | null, any, Context>;
    changePassword?: ChangePasswordResolver<boolean | null, any, Context>;
    twoFactorSet?: TwoFactorSetResolver<boolean | null, any, Context>;
    twoFactorUnset?: TwoFactorUnsetResolver<boolean | null, any, Context>;
  }

  export type ImpersonateResolver<
    R = ImpersonateReturn | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, ImpersonateArgs>;
  export interface ImpersonateArgs {
    accessToken: string;
    username: string;
  }

  export type RefreshTokensResolver<R = LoginResult | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context,
    RefreshTokensArgs
  >;
  export interface RefreshTokensArgs {
    accessToken: string;
    refreshToken: string;
  }

  export type LogoutResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type AuthenticateResolver<R = LoginResult | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context,
    AuthenticateArgs
  >;
  export interface AuthenticateArgs {
    serviceName: string;
    params: AuthenticateParamsInput;
  }

  export type CreateUserResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context,
    CreateUserArgs
  >;
  export interface CreateUserArgs {
    user: CreateUserInput;
  }

  export type VerifyEmailResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context,
    VerifyEmailArgs
  >;
  export interface VerifyEmailArgs {
    token: string;
  }

  export type ResetPasswordResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context,
    ResetPasswordArgs
  >;
  export interface ResetPasswordArgs {
    token: string;
    newPassword: string;
  }

  export type SendVerificationEmailResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, SendVerificationEmailArgs>;
  export interface SendVerificationEmailArgs {
    email: string;
  }

  export type SendResetPasswordEmailResolver<
    R = boolean | null,
    Parent = any,
    Context = any
  > = Resolver<R, Parent, Context, SendResetPasswordEmailArgs>;
  export interface SendResetPasswordEmailArgs {
    email: string;
  }

  export type ChangePasswordResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context,
    ChangePasswordArgs
  >;
  export interface ChangePasswordArgs {
    oldPassword: string;
    newPassword: string;
  }

  export type TwoFactorSetResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context,
    TwoFactorSetArgs
  >;
  export interface TwoFactorSetArgs {
    secret: TwoFactorSecretKeyInput;
    code: string;
  }

  export type TwoFactorUnsetResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context,
    TwoFactorUnsetArgs
  >;
  export interface TwoFactorUnsetArgs {
    code: string;
  }
}

export namespace ImpersonateReturnResolvers {
  export interface Resolvers<Context = any> {
    authorized?: AuthorizedResolver<boolean | null, any, Context>;
    tokens?: TokensResolver<Tokens | null, any, Context>;
    user?: UserResolver<User | null, any, Context>;
  }

  export type AuthorizedResolver<R = boolean | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type TokensResolver<R = Tokens | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UserResolver<R = User | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace TokensResolvers {
  export interface Resolvers<Context = any> {
    refreshToken?: RefreshTokenResolver<string | null, any, Context>;
    accessToken?: AccessTokenResolver<string | null, any, Context>;
  }

  export type RefreshTokenResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type AccessTokenResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace LoginResultResolvers {
  export interface Resolvers<Context = any> {
    sessionId?: SessionIdResolver<string | null, any, Context>;
    tokens?: TokensResolver<Tokens | null, any, Context>;
  }

  export type SessionIdResolver<R = string | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
  export type TokensResolver<R = Tokens | null, Parent = any, Context = any> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace PasswordServiceResolvers {
  export interface Resolvers<Context = any> {
    name?: NameResolver<string, any, Context>;
  }

  export type NameResolver<R = string, Parent = any, Context = any> = Resolver<R, Parent, Context>;
}
