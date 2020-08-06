import { ErrorMessages } from './types';

export const errors: ErrorMessages = {
  invalidMfaToken: 'Invalid mfa token',
  invalidAuthenticatorId: 'Invalid authenticator id',
  authenticatorNotFound: 'Authenticator not found',
  factorNotFound: (factorName: string) => `No service with the name ${factorName} was registered.`,
};

export enum AuthenticateErrors {
  /**
   * Will throw if mfa token validation failed.
   */
  InvalidMfaToken = 'invalidMfaToken',
  /**
   * Mfa factor is not registered on the server
   */
  FactorNotFound = 'factorNotFound',
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
  /**
   * Mfa factor is not registered on the server
   */
  FactorNotFound = 'factorNotFound',
}

export enum AssociateError {
  /**
   * Mfa factor is not registered on the server
   */
  FactorNotFound = 'factorNotFound',
}

export enum AssociateByMfaTokenError {
  /**
   * Will throw if mfa token validation failed.
   */
  InvalidMfaToken = 'invalidMfaToken',
  /**
   * Mfa factor is not registered on the server
   */
  FactorNotFound = 'factorNotFound',
}

export enum FindUserAuthenticatorsByMfaTokenError {
  /**
   * Will throw if mfa token validation failed.
   */
  InvalidMfaToken = 'invalidMfaToken',
}
