// @flow
import type {
  CreateUserType,
  PasswordLoginUserType,
  LoginReturnType,
} from '../common/types';

export interface TransportInterface {
  createUser(user: CreateUserType): string,
  loginWithPassword(user: PasswordLoginUserType, password: string): LoginReturnType,
  logout(): Promise<void>
}
