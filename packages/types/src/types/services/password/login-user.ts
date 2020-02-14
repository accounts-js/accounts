import { LoginUserIdentity } from '../../login-user-identity';
import { PasswordType } from './password-type';

export interface LoginUserPasswordService {
  user: string | LoginUserIdentity;
  password: PasswordType;
  // 2FA code
  code?: string;
}
