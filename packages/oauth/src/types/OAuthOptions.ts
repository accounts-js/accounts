import { OAuthUser } from './OAuthUser'

export interface OAuthOptions {
  [provider: string]: {
    authenticate: (params: any) => Promise<OAuthUser>;
  };
}