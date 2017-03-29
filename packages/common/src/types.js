// @flow

import type { HashAlgorithm } from './config';

export type PasswordType = string | {
  digest: string,
  algorithm: HashAlgorithm
};

export type UserObjectType = {
  username: ?string,
  email: ?string,
  emails?: Object[],
  id: string,
  profile: ?Object,
  services: ?Object
};

export type CreateUserType = {
  username?: string,
  email?: string,
  password?: PasswordType,
  profile?: Object
};

export type PasswordLoginUserIdentityType = {
  id?: string,
  username?: string,
  email?: string
};

export type PasswordLoginUserType = string | PasswordLoginUserIdentityType;

export type TokensType = {
  accessToken: ?string,
  refreshToken: ?string
};

export type LoginReturnType = {
  sessionId: string,
  user: UserObjectType,
  tokens: TokensType
};

export type ImpersonateReturnType = {
  authorized: boolean,
  tokens?: TokensType,
  user?: UserObjectType
};

export type SessionType = {
  sessionId: string,
  userId: string,
  valid: boolean,
  userAgent: ?string,
  createdAt: string,
  updatedAt: string
};
