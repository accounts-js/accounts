import { LoginResult } from './login-result';

interface MultiFactorResult {
  mfaToken: string;
}

export type AuthenticationResult = LoginResult | MultiFactorResult;
