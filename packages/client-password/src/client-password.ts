import { AccountsClient } from '@accounts/client';
import { SHA256 } from 'crypto-js';

// TODO option for the user to change hash algo

export interface AccountsClientPasswordOptions {
  /**
   * Use this method if you want to customize the hashing method
   * By default accounts-js will hash the password using SHA256
   */
  hashPassword?(password: string): string;
}

export class AccountsClientPassword {
  private client: AccountsClient;
  private options: AccountsClientPasswordOptions;

  constructor(client: AccountsClient, options?: AccountsClientPasswordOptions) {
    // TODO check client or throw error
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

  public async verifyEmail(token: string): Promise<void> {
    return this.client.transport.verifyEmail(token);
  }

  public hashPassword(password: string): string {
    if (this.options.hashPassword) {
      return this.options.hashPassword(password);
    }
    const hashedPassword = SHA256(password);
    return hashedPassword.toString();
  }
}
