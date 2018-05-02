import { isFunction, isString, has } from 'lodash';
import { Map } from 'immutable';
import { Store, Middleware } from 'redux';
import * as jwtDecode from 'jwt-decode';
import {
  AccountsError,
  validators,
  CreateUserType,
  LoginUserIdentityType,
  LoginReturnType,
  UserObjectType,
  TokensType,
  ImpersonateReturnType,
} from '@accounts/common';
import { TransportInterface } from './transport-interface';
import { TokenStorage, AccountsClientOptions } from './types';
import { tokenStorageLocal } from './token-storage-local';

enum TokenKey {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
  OriginalAccessToken = 'originalAccessToken',
  OriginalRefreshToken = 'originalRefreshToken',
}

// TODO allow change name of local-storage keys
const defaultOptions = {
  tokenStorage: tokenStorageLocal,
  tokenStoragePrefix: 'accounts',
};

export class AccountsClient {
  private options: AccountsClientOptions;
  private transport: TransportInterface;
  private storage: TokenStorage;

  constructor(options: AccountsClientOptions, transport: TransportInterface) {
    this.options = { ...defaultOptions, ...options };
    this.storage = this.options.tokenStorage;

    if (!transport) {
      throw new AccountsError('A valid transport is required');
    }
    this.transport = transport;
  }

  /**
   * Get the tokens from the storage
   */
  public async getTokens(original?: boolean): Promise<TokensType | null> {
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
  public async setTokens(tokens: TokensType, original?: boolean): Promise<void> {
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
   * Refresh the user session
   * If the tokens have expired try to refresh them
   */
  public async refreshSession(): Promise<TokensType | null> {
    const tokens = await this.getTokens();
    if (tokens) {
      try {
        const currentTime = Date.now() / 1000;
        const decodedAccessToken = jwtDecode(tokens.accessToken) as any;
        const decodedRefreshToken = jwtDecode(tokens.refreshToken) as any;
        // See if accessToken is expired
        if (decodedAccessToken.exp < currentTime) {
          // Request a new token pair
          const refreshedSession = await this.transport.refreshTokens(
            tokens.accessToken,
            tokens.refreshToken
          );

          await this.setTokens(refreshedSession.tokens);
          return refreshedSession.tokens;
        } else if (decodedRefreshToken.exp < currentTime) {
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
  }

  /**
   * Logout the user
   * Call the server to invalidate the tokens
   * Clean user local storage
   */
  public async logout(): Promise<void> {
    try {
      const tokens = await this.getTokens();

      // TODO see if needed, No refresh token here ?
      if (tokens.accessToken) {
        await this.transport.logout(tokens.accessToken);
      }

      this.clearTokens();
    } catch (err) {
      this.clearTokens();
      throw err;
    }
  }

  /**
   * Impersonate to another user.
   */
  public async impersonate(impersonated: {
    userId?: string;
    username?: string;
    email?: string;
  }): Promise<ImpersonateReturnType> {
    const tokens = await this.getTokens();

    if (!tokens) {
      throw new AccountsError('An access token is required');
    }

    const res = await this.transport.impersonate(tokens.accessToken, impersonated);

    if (!res.authorized) {
      throw new AccountsError(`User unauthorized to impersonate`);
    } else {
      if (this.options.persistImpersonation) {
        await this.setTokens(tokens, true);
        await this.setTokens(res.tokens);
      }
      return res;
    }
  }

  /**
   * Stop the user impersonation.
   */
  public async stopImpersonation(): Promise<void> {
    const tokens = await this.getTokens(true);
    this.setTokens(tokens);
    await this.clearTokens(true);
    await this.refreshSession();
  }

  /**
   * Login the user with a specific service
   */
  public async loginWithService(
    service: string,
    credentials: { [key: string]: any }
  ): Promise<LoginReturnType> {
    try {
      const response = await this.transport.loginWithService(service, credentials);
      await this.setTokens(response.tokens);
      return response;
    } catch (err) {
      this.clearTokens();
      throw new AccountsError(err.message);
    }
  }

  private getTokenKey(tokenName: TokenKey): string {
    return `${this.options.tokenStoragePrefix}:${tokenName}`;
  }
}
