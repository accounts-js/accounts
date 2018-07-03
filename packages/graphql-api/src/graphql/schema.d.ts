// tslint:disable
// graphql typescript definitions

declare namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IMutation | IQuery;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IMutation {
    __typename: 'Mutation';
    impersonate: IImpersonateReturn | null;
    refreshTokens: ILoginResult | null;
    logout: boolean | null;
    authenticate: ILoginResult | null;
    register: string | null;
    verifyEmail: boolean | null;
    resetPassword: boolean | null;
    sendVerificationEmail: boolean | null;
    sendResetPasswordEmail: boolean | null;
    changePassword: boolean | null;
    twoFactorSet: boolean | null;
    twoFactorUnset: boolean | null;
  }

  interface IImpersonateOnMutationArguments {
    accessToken: string;
    username: string;
  }

  interface IRefreshTokensOnMutationArguments {
    accessToken: string;
    refreshToken: string;
  }

  interface ILogoutOnMutationArguments {
    accessToken: string;
  }

  interface IAuthenticateOnMutationArguments {
    serviceName: string;
    params: IAuthenticateParamsInput;
  }

  interface IRegisterOnMutationArguments {
    user: ICreateUserInput;
  }

  interface IVerifyEmailOnMutationArguments {
    token: string;
  }

  interface IResetPasswordOnMutationArguments {
    token: string;
    newPassword: string;
  }

  interface ISendVerificationEmailOnMutationArguments {
    email: string;
  }

  interface ISendResetPasswordEmailOnMutationArguments {
    email: string;
  }

  interface IChangePasswordOnMutationArguments {
    oldPassword: string;
    newPassword: string;
  }

  interface ITwoFactorSetOnMutationArguments {
    secret: string;
    code: string;
  }

  interface ITwoFactorUnsetOnMutationArguments {
    code: string;
  }

  interface IImpersonateReturn {
    __typename: 'ImpersonateReturn';
    authorized: boolean | null;
    tokens: ITokens | null;
    user: IUser | null;
  }

  interface ITokens {
    __typename: 'Tokens';
    refreshToken: string | null;
    accessToken: string | null;
  }

  interface IUser {
    __typename: 'User';
    id: string;
    emails: Array<IEmailRecord> | null;
    username: string | null;
  }

  interface IEmailRecord {
    __typename: 'EmailRecord';
    address: string | null;
    verified: boolean | null;
  }

  interface ILoginResult {
    __typename: 'LoginResult';
    sessionId: string | null;
    tokens: ITokens | null;
  }

  interface IAuthenticateParamsInput {
    access_token?: string | null;
    access_token_secret?: string | null;
    provider?: string | null;
    password?: string | null;
    user?: IUserInput | null;
    code?: string | null;
  }

  interface IUserInput {
    id?: string | null;
    email?: string | null;
    username?: string | null;
  }

  interface ICreateUserInput {
    username?: string | null;
    email?: string | null;
    password?: string | null;
    profile?: ICreateUserProfileInput | null;
  }

  interface ICreateUserProfileInput {
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  }

  interface IQuery {
    __typename: 'Query';
    getUser: IUser | null;
    twoFactorSecret: string | null;
  }

  interface IGetUserOnQueryArguments {
    accessToken: string;
  }
}

// tslint:enable
