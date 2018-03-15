import { LoginUserIdentityType } from '@accounts/common';
import { PasswordType } from './password-type';

export interface PasswordLoginType {
  user: string | LoginUserIdentityType;
  // User password
  password: PasswordType;
  // Two factor code
  code?: string;
}
