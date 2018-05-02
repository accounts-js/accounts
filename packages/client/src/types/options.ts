import { TokenStorage } from '.';

export interface AccountsClientOptions {
  tokenStorage: TokenStorage;
  tokenStoragePrefix?: string;
  persistImpersonation?: boolean;
}
