import {
  AuthenticationResult,
  ImpersonationResult,
  CreateUser,
  User,
  CreateUserResult,
  Authenticator,
  LoginResult,
} from '@accounts/types';
import { AccountsClient } from './accounts-client';

export interface TransportInterface extends TransportMfaInterface {
  client: AccountsClient;
  createUser(user: CreateUser): Promise<CreateUserResult>;
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
  ): Promise<AuthenticationResult>;
  logout(): Promise<void>;
  getUser(): Promise<User>;
  refreshTokens(accessToken: string, refreshToken: string): Promise<LoginResult>;
  verifyEmail(token: string): Promise<void>;
  sendResetPasswordEmail(email: string): Promise<void>;
  sendVerificationEmail(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<LoginResult | null>;
  addEmail(newEmail: string): Promise<void>;
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

/**
 * MFA related operations
 */
interface TransportMfaInterface {
  mfaAssociate(type: string): Promise<any>;
  authenticators(mfaToken?: string): Promise<Authenticator[]>;
  mfaChallenge(mfaToken: string, authenticatorId: string): Promise<any>;
}
