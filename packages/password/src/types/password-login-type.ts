import { LoginUserIdentityType } from '@accounts/common';
import { PasswordType } from './password-type';

export interface PasswordLoginType {
  id?: string;
  username?: string;
  email?: string;
  password: PasswordType;
  // 2FA code
  code?: string;
}
