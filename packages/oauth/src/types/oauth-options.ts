import { OAuthUser } from './oauth-user'

export interface OAuthOptions {
  [provider: string]: {
    authenticate: (params: any) => Promise<OAuthUser>;
  };
}