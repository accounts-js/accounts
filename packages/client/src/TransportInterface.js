// @flow
/* eslint-disable max-len */
import type {
  CreateUserType,
  PasswordLoginUserType,
  LoginReturnType,
  PasswordType,
  ImpersonateReturnType,
} from '@accounts/common';

export interface TransportInterface {
  createUser(user: CreateUserType): Promise<string>,
  loginWithPassword(user: PasswordLoginUserType, password: PasswordType): Promise<LoginReturnType>,
  logout(accessToken: string): Promise<void>,
  refreshTokens(accessToken: string, refreshToken: string) : Promise<LoginReturnType>,
  verifyEmail(token: string): Promise<void>,
  resetPassword(token: string, newPassword: PasswordType): Promise<void>,
  sendResetPasswordEmail(email: string): Promise<void>,
  sendVerificationEmail(email: string): Promise<void>,
  impersonate(token: string, username: string): Promise<ImpersonateReturnType>
}
