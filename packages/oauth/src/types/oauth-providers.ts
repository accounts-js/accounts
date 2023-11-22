import { type OAuthProvider } from './oauth-provider';

export interface OAuthProviders {
  [key: string]: (new (args: any) => OAuthProvider) | OAuthProvider | undefined;
}
