// @flow
/* eslint-disable max-len */
import type {
  CreateUserType,
  PasswordLoginUserType,
  LoginReturnType,
} from '@accounts/common';

export interface TransportInterface {
  createUser(user: CreateUserType, args): Promise<string>,
  loginWithPassword(user: PasswordLoginUserType, password: string, args): Promise<LoginReturnType>,
  logout(accessToken: string, args): Promise<void>,
  refreshTokens(accessToken: string, refreshToken: string, args) : Promise<LoginReturnType>,
  verifyEmail(token: string, args): Promise<void>,
  resetPassword(token: string, newPassword: string, args): Promise<void>,
  sendResetPasswordEmail(email: string): Promise<void>,
  sendVerificationEmail(email: string): Promise<void>,
  impersonate(token: string, username: string),
}
