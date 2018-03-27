import { LoginUserIdentityType } from '@accounts/common';
import { PasswordType } from './password-type';

export interface PasswordLoginType {
  user: string | LoginUserIdentityType;
  password: PasswordType;
  // 2FA code
  code?: string;
}
