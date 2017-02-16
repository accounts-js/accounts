// @flow

export type UserObjectType = {
  username: ?string,
  email: ?string,
  id: ?string,
  profile: ?Object,
  services: ?Object
};

export type CreateUserType = {
  username: ?string,
  email: ?string,
  password: ?string,
  profile: ?Object
};

export type PasswordLoginUserType = string | {
  id: ?string,
  username: ?string,
  email: ?string
};

export type TokensType = {
  accessToken: ?string,
  refreshToken: ?string
};

export type LoginReturnType = {
  sessionId: string,
  user: UserObjectType,
  tokens: TokensType
};

export type SessionType = {
  sessionId: string,
  userId: string,
  valid: boolean,
  userAgent: ?string,
  createdAt: string,
  updatedAt: string
};
