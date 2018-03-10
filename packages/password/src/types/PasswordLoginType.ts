import { LoginUserIdentityType } from '@accounts/common';
import { PasswordType } from './PasswordType'

export interface PasswordLoginType {
  user: string | LoginUserIdentityType;
  password: PasswordType;
}