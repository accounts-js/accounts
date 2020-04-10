import { OAuthProvider } from './oauth-provider';

export interface OAuthOptions {
  [provider: string]: OAuthProvider;
}
