// @flow
/* eslint-disable max-len */
import type {
  CreateUserType,
  PasswordLoginUserType,
  LoginReturnType,
  ResumeSessionType,
} from '../common/types';

export interface TransportInterface {
  createUser(user: CreateUserType): string,
  loginWithPassword(user: PasswordLoginUserType, password: string): Promise<LoginReturnType>,
  logout(accessToken: string, refreshToken: string): Promise<void>,
  refreshTokens(accessToken: string, refreshToken: string) : Promise<LoginReturnType>,
  resumeSession(accessToken: string, refreshToken: string) : Promise<ResumeSessionType>
}
