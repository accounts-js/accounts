export interface OAuthProvider {
  name: string;
}

export interface OAuthProviders {
  [key: string]: OAuthProvider
}