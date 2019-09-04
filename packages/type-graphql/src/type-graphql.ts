/* tslint:disable */
import * as TypeGraphQL from 'type-graphql';
export type Maybe<T> = T | null;
type FixDecorator<T> = T;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

@TypeGraphQL.InterfaceType()
export class User {
  __typename?: 'User';

  @TypeGraphQL.Field(type => TypeGraphQL.ID)
  id!: Scalars['ID'];

  @TypeGraphQL.Field(type => [EmailRecord], { nullable: true })
  emails!: Maybe<Array<EmailRecord>>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  username!: Maybe<Scalars['String']>;
}

@TypeGraphQL.InterfaceType()
export class TwoFactorSecretKey {
  __typename?: 'TwoFactorSecretKey';

  @TypeGraphQL.Field(type => String, { nullable: true })
  ascii!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  base32!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  hex!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  qr_code_ascii!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  qr_code_hex!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  qr_code_base32!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  google_auth_qr!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  otpauth_url!: Maybe<Scalars['String']>;
}

@TypeGraphQL.InterfaceType()
export class Tokens {
  __typename?: 'Tokens';

  @TypeGraphQL.Field(type => String, { nullable: true })
  refreshToken!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  accessToken!: Maybe<Scalars['String']>;
}

@TypeGraphQL.InterfaceType()
export class LoginResult {
  __typename?: 'LoginResult';

  @TypeGraphQL.Field(type => String, { nullable: true })
  sessionId!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => Tokens, { nullable: true })
  tokens!: Maybe<Tokens>;
}

@TypeGraphQL.InterfaceType()
export class ImpersonateReturn {
  __typename?: 'ImpersonateReturn';

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  authorized!: Maybe<Scalars['Boolean']>;

  @TypeGraphQL.Field(type => Tokens, { nullable: true })
  tokens!: Maybe<Tokens>;

  @TypeGraphQL.Field(type => User, { nullable: true })
  user!: Maybe<User>;
}

@TypeGraphQL.InterfaceType()
export class EmailRecord {
  __typename?: 'EmailRecord';

  @TypeGraphQL.Field(type => String, { nullable: true })
  address!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  verified!: Maybe<Scalars['Boolean']>;
}

@TypeGraphQL.InputType()
export class AuthenticateParamsInput {
  @TypeGraphQL.Field(type => String, { nullable: true })
  access_token!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  access_token_secret!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  provider!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  password!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => UserInput, { nullable: true })
  user!: Maybe<UserInput>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  code!: Maybe<Scalars['String']>;
}

@TypeGraphQL.InputType()
export class CreateUserInput {
  @TypeGraphQL.Field(type => String, { nullable: true })
  username!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  email!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  password!: Maybe<Scalars['String']>;
}

export class Mutation {
  __typename?: 'Mutation';

  @TypeGraphQL.Field(type => TypeGraphQL.ID, { nullable: true })
  createUser!: Maybe<Scalars['ID']>;

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  verifyEmail!: Maybe<Scalars['Boolean']>;

  @TypeGraphQL.Field(type => LoginResult, { nullable: true })
  resetPassword!: Maybe<LoginResult>;

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  sendVerificationEmail!: Maybe<Scalars['Boolean']>;

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  sendResetPasswordEmail!: Maybe<Scalars['Boolean']>;

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  changePassword!: Maybe<Scalars['Boolean']>;

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  twoFactorSet!: Maybe<Scalars['Boolean']>;

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  twoFactorUnset!: Maybe<Scalars['Boolean']>;

  @TypeGraphQL.Field(type => ImpersonateReturn, { nullable: true })
  impersonate!: Maybe<ImpersonateReturn>;

  @TypeGraphQL.Field(type => LoginResult, { nullable: true })
  refreshTokens!: Maybe<LoginResult>;

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  logout!: Maybe<Scalars['Boolean']>;

  @TypeGraphQL.Field(type => LoginResult, { nullable: true })
  authenticate!: Maybe<LoginResult>;
}

@TypeGraphQL.ArgsType()
export class MutationCreateUserArgs {
  @TypeGraphQL.Field(type => CreateUserInput)
  user!: FixDecorator<CreateUserInput>;
}

@TypeGraphQL.ArgsType()
export class MutationVerifyEmailArgs {
  @TypeGraphQL.Field(type => String)
  token!: Scalars['String'];
}

@TypeGraphQL.ArgsType()
export class MutationResetPasswordArgs {
  @TypeGraphQL.Field(type => String)
  token!: Scalars['String'];

  @TypeGraphQL.Field(type => String)
  newPassword!: Scalars['String'];
}

@TypeGraphQL.ArgsType()
export class MutationSendVerificationEmailArgs {
  @TypeGraphQL.Field(type => String)
  email!: Scalars['String'];
}

@TypeGraphQL.ArgsType()
export class MutationSendResetPasswordEmailArgs {
  @TypeGraphQL.Field(type => String)
  email!: Scalars['String'];
}

@TypeGraphQL.ArgsType()
export class MutationChangePasswordArgs {
  @TypeGraphQL.Field(type => String)
  oldPassword!: Scalars['String'];

  @TypeGraphQL.Field(type => String)
  newPassword!: Scalars['String'];
}

@TypeGraphQL.ArgsType()
export class MutationTwoFactorSetArgs {
  @TypeGraphQL.Field(type => TwoFactorSecretKeyInput)
  secret!: FixDecorator<TwoFactorSecretKeyInput>;

  @TypeGraphQL.Field(type => String)
  code!: Scalars['String'];
}

@TypeGraphQL.ArgsType()
export class MutationTwoFactorUnsetArgs {
  @TypeGraphQL.Field(type => String)
  code!: Scalars['String'];
}

@TypeGraphQL.ArgsType()
export class MutationImpersonateArgs {
  @TypeGraphQL.Field(type => String)
  accessToken!: Scalars['String'];

  @TypeGraphQL.Field(type => String)
  username!: Scalars['String'];
}

@TypeGraphQL.ArgsType()
export class MutationRefreshTokensArgs {
  @TypeGraphQL.Field(type => String)
  accessToken!: Scalars['String'];

  @TypeGraphQL.Field(type => String)
  refreshToken!: Scalars['String'];
}

@TypeGraphQL.ArgsType()
export class MutationAuthenticateArgs {
  @TypeGraphQL.Field(type => String)
  serviceName!: Scalars['String'];

  @TypeGraphQL.Field(type => AuthenticateParamsInput)
  params!: FixDecorator<AuthenticateParamsInput>;
}

export class Query {
  __typename?: 'Query';

  @TypeGraphQL.Field(type => TwoFactorSecretKey, { nullable: true })
  twoFactorSecret!: Maybe<TwoFactorSecretKey>;

  @TypeGraphQL.Field(type => User, { nullable: true })
  getUser!: Maybe<User>;
}

@TypeGraphQL.InputType()
export class TwoFactorSecretKeyInput {
  @TypeGraphQL.Field(type => String, { nullable: true })
  ascii!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  base32!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  hex!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  qr_code_ascii!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  qr_code_hex!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  qr_code_base32!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  google_auth_qr!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  otpauth_url!: Maybe<Scalars['String']>;
}

@TypeGraphQL.InputType()
export class UserInput {
  @TypeGraphQL.Field(type => TypeGraphQL.ID, { nullable: true })
  id!: Maybe<Scalars['ID']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  email!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  username!: Maybe<Scalars['String']>;
}
