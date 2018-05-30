import { AccountsClient } from '@accounts/client';
import { SHA256 } from 'crypto-js';
import { AccountsClientPasswordOptions } from './types';

export class AccountsClientPassword {
  private client: AccountsClient;
  private options: AccountsClientPasswordOptions;

  constructor(client: AccountsClient, options: AccountsClientPasswordOptions = {}) {
    if (!client) {
      throw new Error('A valid client instance is required');
    }
    this.client = client;
    this.options = options;
  }

  // TODO type
  public async createUser(user: any): Promise<string> {
    const hashedPassword = this.hashPassword(user.password);
    return this.client.transport.createUser({ ...user, password: hashedPassword });
  }

  // TODO type
  public async login(user: any): Promise<any> {
    const hashedPassword = this.hashPassword(user.password);
    await this.client.loginWithService('password', {
      ...user,
      password: hashedPassword,
    });
  }

  public requestPasswordReset(email: string): Promise<void> {
    return this.client.transport.sendResetPasswordEmail(email);
  }

  public resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedPassword = this.hashPassword(newPassword);
    return this.client.transport.resetPassword(token, hashedPassword);
  }

  public requestVerificationEmail(email: string): Promise<void> {
    return this.client.transport.sendVerificationEmail(email);
  }

  public verifyEmail(token: string): Promise<void> {
    return this.client.transport.verifyEmail(token);
  }

  public changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const hashedPassword = this.hashPassword(newPassword);
    return this.client.transport.changePassword(oldPassword, hashedPassword);
  }

  public hashPassword(password: string): string {
    if (this.options.hashPassword) {
      return this.options.hashPassword(password);
    }
    const hashedPassword = SHA256(password);
    return hashedPassword.toString();
  }
}
