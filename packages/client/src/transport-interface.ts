import { LoginResult, ImpersonationResult } from '@accounts/types';

export interface TransportInterface {
  loginWithService(
    service: string,
    authenticateParams: {
      [key: string]: string | object;
    }
  ): Promise<LoginResult>;
  logout(accessToken: string): Promise<void>;
  refreshTokens(accessToken: string, refreshToken: string): Promise<LoginResult>;
  verifyEmail(token: string): Promise<void>;
  sendResetPasswordEmail(email: string): Promise<void>;
  sendVerificationEmail(email: string): Promise<void>;
  impersonate(
    token: string,
    impersonated: {
      userId?: string;
      username?: string;
      email?: string;
    }
  ): Promise<ImpersonationResult>;
}
