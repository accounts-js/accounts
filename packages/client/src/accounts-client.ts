import { LoginResult, Tokens, ImpersonationResult } from '@accounts/types';
import { TransportInterface } from './transport-interface';
import { TokenStorage, AccountsClientOptions, AccountsClientPrivateOptions } from './types';
import { tokenStorageLocal } from './token-storage-local';
import { isTokenExpired } from './utils';

enum TokenKey {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
  OriginalAccessToken = 'originalAccessToken',
  OriginalRefreshToken = 'originalRefreshToken',
}

const defaultOptions = {
  tokenStorage: tokenStorageLocal,
  tokenStoragePrefix: 'accounts',
};

export class AccountsClient {
  public transport: TransportInterface;
  private options: AccountsClientPrivateOptions;
  private storage: TokenStorage;

  constructor(options: AccountsClientOptions, transport: TransportInterface) {
    this.options = { ...defaultOptions, ...options };
    this.storage = this.options.tokenStorage;

    if (!transport) {
      throw new Error('A valid transport is required');
    }
    this.transport = transport;
    this.transport.client = this;
  }

  /**
   * Get the tokens from the storage
   */
  public async getTokens(original?: boolean): Promise<Tokens | null> {
    const accessToken = await this.storage.getItem(
      original
        ? this.getTokenKey(TokenKey.OriginalAccessToken)
        : this.getTokenKey(TokenKey.AccessToken)
    );
    const refreshToken = await this.storage.getItem(
      original
        ? this.getTokenKey(TokenKey.OriginalRefreshToken)
        : this.getTokenKey(TokenKey.RefreshToken)
    );
    if (!accessToken || !refreshToken) {
      return null;
    }
    return { accessToken, refreshToken };
  }

  /**
   * Store the tokens in the storage
   */
  public async setTokens(tokens: Tokens, original?: boolean): Promise<void> {
    await this.storage.setItem(
      original
        ? this.getTokenKey(TokenKey.OriginalAccessToken)
        : this.getTokenKey(TokenKey.AccessToken),
      tokens.accessToken
    );
    await this.storage.setItem(
      original
        ? this.getTokenKey(TokenKey.OriginalRefreshToken)
        : this.getTokenKey(TokenKey.RefreshToken),
      tokens.refreshToken
    );
  }

  /**
   * Remove the tokens from the storage
   */
  public async clearTokens(original?: boolean): Promise<void> {
    await this.storage.removeItem(
      original
        ? this.getTokenKey(TokenKey.OriginalAccessToken)
        : this.getTokenKey(TokenKey.AccessToken)
    );
    await this.storage.removeItem(
      original
        ? this.getTokenKey(TokenKey.OriginalRefreshToken)
        : this.getTokenKey(TokenKey.RefreshToken)
    );
  }

  /**
   * Login the user with a specific service
   */
  public async loginWithService(
    service: string,
    credentials: { [key: string]: any }
  ): Promise<LoginResult> {
    const response = await this.transport.loginWithService(service, credentials);
    await this.setTokens(response.tokens);
    return response;
  }

  /**
   * Refresh the user session
   * If the tokens have expired try to refresh them
   */
  public async refreshSession(): Promise<Tokens | null> {
    const tokens = await this.getTokens();
    if (tokens) {
      try {
        // See if accessToken is expired and refreshToken is not
        if (isTokenExpired(tokens.accessToken) && !isTokenExpired(tokens.refreshToken)) {
          // Request a new token pair
          const refreshedSession = await this.transport.refreshTokens(
            tokens.accessToken,
            tokens.refreshToken
          );

          await this.setTokens(refreshedSession.tokens);
          return refreshedSession.tokens;
        } else if (isTokenExpired(tokens.refreshToken)) {
          // Refresh token is expired, user must sign back in
          this.clearTokens();
          return null;
        }
        return tokens;
      } catch (err) {
        this.clearTokens();
        throw err;
      }
    }
    return null;
  }

  /**
   * Impersonate to another user.
   */
  public async impersonate(impersonated: {
    userId?: string;
    username?: string;
    email?: string;
  }): Promise<ImpersonationResult> {
    const tokens = await this.getTokens();

    if (!tokens) {
      throw new Error('An access token is required');
    }

    const res = await this.transport.impersonate(tokens.accessToken, impersonated);

    if (!res.authorized || !res.tokens) {
      throw new Error(`User unauthorized to impersonate`);
    } else {
      await this.setTokens(tokens, true);
      await this.setTokens(res.tokens);
      return res;
    }
  }

  /**
   * Stop the user impersonation.
   */
  public async stopImpersonation(): Promise<void> {
    const tokens = await this.getTokens(true);
    if (tokens) {
      await this.setTokens(tokens);
      await this.clearTokens(true);
    }
  }

  /**
   * Logout the user
   * Call the server to invalidate the tokens
   * Clean user local storage
   */
  public async logout(): Promise<void> {
    const tokens = await this.getTokens();
    if (tokens) {
      await this.transport.logout(tokens.accessToken);
    }
    await this.clearTokens();
  }

  private getTokenKey(tokenName: TokenKey): string {
    return `${this.options.tokenStoragePrefix}:${tokenName}`;
  }
}
