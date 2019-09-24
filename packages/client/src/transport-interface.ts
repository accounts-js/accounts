import { LoginResult, ImpersonationResult, CreateUser, User } from '@accounts/types';
import { AccountsClient } from './accounts-client';

export interface TransportInterface {
  client: AccountsClient;
  createUser(user: CreateUser): Promise<string>;
  authenticateWithService(
    service: string,
    authenticateParams: {
      [key: string]: string | object;
    }
  ): Promise<boolean>;
  loginWithService(
    service: string,
    authenticateParams: {
      [key: string]: string | object;
    }
  ): Promise<LoginResult>;
  logout(): Promise<void>;
  getUser(): Promise<User>;
  refreshTokens(accessToken: string, refreshToken: string): Promise<LoginResult>;
  verifyEmail(token: string): Promise<void>;
  sendResetPasswordEmail(email: string): Promise<void>;
  sendVerificationEmail(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<LoginResult | null>;
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
