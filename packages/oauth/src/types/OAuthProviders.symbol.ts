import { InjectionToken } from 'graphql-modules';
import { type OAuthProviders } from './oauth-providers';

export const OAuthProvidersToken = new InjectionToken<OAuthProviders>('OauthProviders');
