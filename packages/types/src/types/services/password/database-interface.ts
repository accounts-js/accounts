import { User } from '../../user';

export interface DatabaseInterfaceServicePassword {
  findUserByEmail(email: string): Promise<User | null>;

  findUserByUsername(username: string): Promise<User | null>;

  findUserByResetPasswordToken(token: string): Promise<User | null>;

  findUserByEmailVerificationToken(token: string): Promise<User | null>;

  findPasswordHash(userId: string): Promise<string | null>;

  setPassword(userId: string, newPassword: string): Promise<void>;

  setUsername(userId: string, newUsername: string): Promise<void>;

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
