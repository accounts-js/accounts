import { type OAuthUser } from '@accounts/oauth';

export interface Configuration {
  getRegistrationPayload?: (oauthUser: OAuthUser) => Promise<any>;
}
