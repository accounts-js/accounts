import { User } from '../user';

export interface DatabaseInterfacePassword {
  findUserByResetPasswordToken(token: string): Promise<User | null>;

  findUserByEmailVerificationToken(token: string): Promise<User | null>;

  findPasswordHash(userId: string): Promise<string | null>;

  setPassword(userId: string, newPassword: string): Promise<void>;

  addResetPasswordToken(
    userId: string,
    email: string,
    token: string,
    reason: string
  ): Promise<void>;

  setResetPassword(
    userId: string,
    email: string,
    newPassword: string,
    token: string
  ): Promise<void>;

  addEmail(userId: string, newEmail: string, verified: boolean): Promise<void>;

  removeEmail(userId: string, email: string): Promise<void>;

  verifyEmail(userId: string, email: string): Promise<void>;

  addEmailVerificationToken(userId: string, email: string, token: string): Promise<void>;
}
