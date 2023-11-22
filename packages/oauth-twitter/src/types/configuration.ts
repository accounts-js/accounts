import { type OAuthUser } from '@accounts/oauth';

export interface Configuration {
  key: string;
  secret: string;
  getRegistrationPayload?: (oauthUser: OAuthUser) => Promise<any>;
}
