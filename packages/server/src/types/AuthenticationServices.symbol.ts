import { InjectionToken } from 'graphql-modules';
import { type AuthenticationServices } from './authentication-services';

export const AuthenticationServicesToken = new InjectionToken<AuthenticationServices>(
  'AuthenticationServices'
);
