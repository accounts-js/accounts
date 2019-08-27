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

export type AuthenticateParamsInput = {
  access_token?: Maybe<Scalars['String']>;
  access_token_secret?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  user?: Maybe<UserInput>;
  code?: Maybe<Scalars['String']>;
};

export type CreateUserInput = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

@TypeGraphQL.ObjectType()
export class EmailRecord {
  __typename?: 'EmailRecord';

  @TypeGraphQL.Field(type => String, { nullable: true })
  address!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  verified!: Maybe<Scalars['Boolean']>;
}

@TypeGraphQL.ObjectType()
export class ImpersonateReturn {
  __typename?: 'ImpersonateReturn';

  @TypeGraphQL.Field(type => Boolean, { nullable: true })
  authorized!: Maybe<Scalars['Boolean']>;

  @TypeGraphQL.Field(type => Tokens, { nullable: true })
  tokens!: Maybe<Tokens>;

  @TypeGraphQL.Field(type => User, { nullable: true })
  user!: Maybe<User>;
}

@TypeGraphQL.ObjectType()
export class LoginResult {
  __typename?: 'LoginResult';

  @TypeGraphQL.Field(type => String, { nullable: true })
  sessionId!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => Tokens, { nullable: true })
  tokens!: Maybe<Tokens>;
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

export type MutationCreateUserArgs = {
  user: CreateUserInput;
};

export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};

export type MutationResetPasswordArgs = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
};

export type MutationSendVerificationEmailArgs = {
  email: Scalars['String'];
};

export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String'];
};

export type MutationChangePasswordArgs = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
};

export type MutationTwoFactorSetArgs = {
  secret: TwoFactorSecretKeyInput;
  code: Scalars['String'];
};

export type MutationTwoFactorUnsetArgs = {
  code: Scalars['String'];
};

export type MutationImpersonateArgs = {
  accessToken: Scalars['String'];
  username: Scalars['String'];
};

export type MutationRefreshTokensArgs = {
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type MutationAuthenticateArgs = {
  serviceName: Scalars['String'];
  params: AuthenticateParamsInput;
};

export class Query {
  __typename?: 'Query';

  @TypeGraphQL.Field(type => TwoFactorSecretKey, { nullable: true })
  twoFactorSecret!: Maybe<TwoFactorSecretKey>;

  @TypeGraphQL.Field(type => User, { nullable: true })
  getUser!: Maybe<User>;
}

@TypeGraphQL.ObjectType()
export class Tokens {
  __typename?: 'Tokens';

  @TypeGraphQL.Field(type => String, { nullable: true })
  refreshToken!: Maybe<Scalars['String']>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  accessToken!: Maybe<Scalars['String']>;
}

@TypeGraphQL.ObjectType()
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

export type TwoFactorSecretKeyInput = {
  ascii?: Maybe<Scalars['String']>;
  base32?: Maybe<Scalars['String']>;
  hex?: Maybe<Scalars['String']>;
  qr_code_ascii?: Maybe<Scalars['String']>;
  qr_code_hex?: Maybe<Scalars['String']>;
  qr_code_base32?: Maybe<Scalars['String']>;
  google_auth_qr?: Maybe<Scalars['String']>;
  otpauth_url?: Maybe<Scalars['String']>;
};

@TypeGraphQL.ObjectType()
export class User {
  __typename?: 'User';

  @TypeGraphQL.Field(type => TypeGraphQL.ID)
  id!: Scalars['ID'];

  @TypeGraphQL.Field(type => [EmailRecord], { nullable: true })
  emails!: Maybe<Array<EmailRecord>>;

  @TypeGraphQL.Field(type => String, { nullable: true })
  username!: Maybe<Scalars['String']>;
}

export type UserInput = {
  id?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};
