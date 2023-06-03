import { InjectionToken } from 'graphql-modules';
import { OAuthProviders } from './oauth-providers';

export const OAuthProvidersToken = new InjectionToken<OAuthProviders>('OauthProviders');
