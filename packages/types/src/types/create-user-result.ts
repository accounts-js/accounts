import { LoginResult } from './login-result';

export interface CreateUserResult {
  userId?: string;
  loginResult?: LoginResult;
}
