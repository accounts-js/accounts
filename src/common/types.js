// @flow

export type UserObjectType = {
  username: ?string,
  email: ?string,
  id: ?string,
  profile: ?Object
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

export type LoginReturnType = {

};

export type SessionType = {
  accessToken: ?string,
  refreshToken: ?string
};
