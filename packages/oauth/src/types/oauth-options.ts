import { OAuthUser } from './oauth-user';

export interface OAuthOptions {
  [provider: string]: {
    /**
     * Should return oauth user payload from passed authentication code or token
     */
    authenticate: (params: any) => Promise<OAuthUser>;
    /**
     * Allows to provide function to create custom payload for user creation method based on data from OAuth API
     */
    getRegistrationPayload?: (oauthUser: OAuthUser) => Promise<any>;
  };
}
