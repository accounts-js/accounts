import { LoginResult } from './login-result';

export interface CreateUserResult {
  /**
   * Will be returned only if 'ambiguousErrorMessages' is set to false or 'requireEmailVerification' is set to false.
   */
  userId?: string;
  /**
   * Will be returned only if 'enableAutologin' is set to true and 'requireEmailVerification' is set to false.
   */
  loginResult?: LoginResult;
}
