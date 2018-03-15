import { OAuthUser } from './oauth-user';

export interface Configuration {
  [provider: string]: {
    authenticate: (params: any) => Promise<OAuthUser>;
  };
}
