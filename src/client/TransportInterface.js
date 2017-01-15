// @flow
import type {
  UserObjectType,
  CreateUserType,
  PasswordLoginUserType,
  LoginReturnType,
  TokensType,
} from '../common/types';

export interface TransportInterface {
  createUser(user: CreateUserType): string,
  loginWithPassword(user: PasswordLoginUserType, password: string): LoginReturnType,
  logout(): Promise<void>,
  resumeSession(sessionId: string, tokens: TokensType) : Promise<UserObjectType>
}
