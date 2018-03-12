import { CreateUserType, LoginReturnType, ImpersonateReturnType } from '@accounts/common';

export interface TransportInterface {
  createUser(user: CreateUserType): Promise<string>;
  loginWithService(
    service: string,
    authenticateParams: {
      [key: string]: string | object;
    }
  ): Promise<LoginReturnType>;
  logout(accessToken: string): Promise<void>;
  refreshTokens(accessToken: string, refreshToken: string): Promise<LoginReturnType>;
  verifyEmail(token: string): Promise<void>;
  sendResetPasswordEmail(email: string): Promise<void>;
  sendVerificationEmail(email: string): Promise<void>;
  impersonate(token: string, username: string): Promise<ImpersonateReturnType>;
}
