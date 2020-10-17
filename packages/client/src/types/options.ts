import { TokenStorage } from '.';

export interface AccountsClientOptions {
  /**
   * Storage that accounts-js will use to store the tokens.
   * Default: 'localStorage'.
   */
  tokenStorage?: TokenStorage;
  /**
   * Token that will prefix the storage key.
   * Default: 'accounts'.
   */
  tokenStoragePrefix?: string;
  /**
   * String or character that will separate the storage key name from it's value.
   * Default: ':'.
   */
  tokenStorageSeparator?: string;
}
