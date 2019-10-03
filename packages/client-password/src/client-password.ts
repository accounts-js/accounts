import { AccountsClient } from '@accounts/client';
import { LoginResult } from '@accounts/types';
import { PasswordCreateUserType, PasswordLoginType } from '@accounts/password';
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

  /**
   * Create a new user.
   */
  public async createUser(user: PasswordCreateUserType): Promise<string> {
    let hashedPassword = user.password;
    if (typeof user.password === 'string') {
      // mostly just a type check
      hashedPassword = this.hashPassword(user.password);
    }
    return this.client.transport.createUser({ ...user, password: hashedPassword });
  }

  /**
   * Log the user in with a password.
   */
  public async login(user: PasswordLoginType): Promise<LoginResult> {
    let hashedPassword = user.password;
    if (typeof user.password === 'string') {
      // mostly just a type check maybe throw if it's not a string?
      hashedPassword = this.hashPassword(user.password);
    }
    return this.client.loginWithService('password', {
      ...user,
      password: hashedPassword,
    });
  }

  /**
   * Request a forgot password email.
   * @param {string} email - The email address to send a password reset link.
   */
  public requestPasswordReset(email: string): Promise<void> {
    return this.client.transport.sendResetPasswordEmail(email);
  }

  /**
   * Reset the password for a user using a token received in email.
   * @param {string} token - The token retrieved from the reset password URL.
   * @param {string} newPassword - A new password for the user. The password is not sent in plain text.
   */
  public resetPassword(token: string, newPassword: string): Promise<LoginResult | null> {
    const hashedPassword = this.hashPassword(newPassword);
    return this.client.transport.resetPassword(token, hashedPassword);
  }

  /**
   * Send an email with a link the user can use verify their email address.
   * @param {string} email - The email address to send the verification link.
   */
  public requestVerificationEmail(email: string): Promise<void> {
    return this.client.transport.sendVerificationEmail(email);
  }

  /**
   * Marks the user's email address as verified.
   * @param {string} token - The token retrieved from the verification URL.
   */
  public verifyEmail(token: string): Promise<void> {
    return this.client.transport.verifyEmail(token);
  }

  /**
   * Change the current user's password. Must be logged in.
   * @param {string} oldPassword - The user's current password.
   * @param {string} newPassword - A new password for the user.
   */
  public changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return this.client.transport.changePassword(
      this.hashPassword(oldPassword),
      this.hashPassword(newPassword)
    );
  }

  /**
   * Utility function that will return the password hashed.
   * @param {string} password - The password to hash.
   */
  public hashPassword(password: string): string {
    if (this.options.hashPassword) {
      return this.options.hashPassword(password);
    }
    return password;
  }
}
