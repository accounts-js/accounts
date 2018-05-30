import { LoginResult, ImpersonationResult, CreateUser } from '@accounts/types';

export interface TransportInterface {
  createUser(user: CreateUser): Promise<string>;
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
  resetPassword(token: string, newPassword: string): Promise<void>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
  impersonate(
    token: string,
    impersonated: {
      userId?: string;
      username?: string;
      email?: string;
    }
  ): Promise<ImpersonationResult>;
}
