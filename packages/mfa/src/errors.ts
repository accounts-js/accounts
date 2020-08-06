import { ErrorMessages } from './types';

export const errors: ErrorMessages = {
  invalidMfaToken: 'Invalid mfa token',
  invalidAuthenticatorId: 'Invalid authenticator id',
  authenticatorNotFound: 'Authenticator not found',
};

export enum AuthenticateErrors {
  /**
   * Will throw if mfa token validation failed.
   */
  InvalidMfaToken = 'invalidMfaToken',
}

export enum ChallengeErrors {
  /**
   * Will throw if mfa token validation failed.
   */
  InvalidMfaToken = 'invalidMfaToken',
  /**
   * Will throw if authenticator id validation failed.
   */
  InvalidAuthenticatorId = 'invalidAuthenticatorId',
  /**
   * Will throw if authenticator is not found.
   */
  AuthenticatorNotFound = 'authenticatorNotFound',
}

export enum AssociateByMfaTokenError {
  /**
   * Will throw if mfa token validation failed.
   */
  InvalidMfaToken = 'invalidMfaToken',
}

export enum FindUserAuthenticatorsByMfaTokenError {
  /**
   * Will throw if mfa token validation failed.
   */
  InvalidMfaToken = 'invalidMfaToken',
}
