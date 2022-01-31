import { InjectionToken } from 'graphql-modules';
import { AuthenticationServices } from './authentication-services';

export const AuthenticationServicesToken = new InjectionToken<AuthenticationServices>(
  'AuthenticationServices'
);
