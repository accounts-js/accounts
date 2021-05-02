import { AccountsClient } from '@accounts/client';
import { LoginResult, LoginUserTokenService } from '@accounts/types';

export class AccountsClientToken {
  private client: AccountsClient;

  constructor(client: AccountsClient) {
    if (!client) {
      throw new Error('A valid client instance is required');
    }
    this.client = client;
  }

  /**
   * Log the user in with a token.
   */
  public async login(user: LoginUserTokenService): Promise<LoginResult> {
    return this.client.loginWithService('token', user);
  }

  /**
   * Request a new login token.
   * @param {string} email - The email address to send a password reset link.
   */
  public requestLoginToken(email: string): Promise<void> {
    return this.client.transport.requestLoginToken(email);
  }
}
