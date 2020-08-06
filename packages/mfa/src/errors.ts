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
  InvalidMfaToken = 'InvalidMfaToken',
  /**
   * Mfa factor is not registered on the server
   */
  FactorNotFound = 'FactorNotFound',
}

export enum ChallengeErrors {
  /**
   * Will throw if mfa token validation failed.
   */
  InvalidMfaToken = 'InvalidMfaToken',
  /**
   * Will throw if authenticator id validation failed.
   */
  InvalidAuthenticatorId = 'InvalidAuthenticatorId',
  /**
   * Will throw if authenticator is not found.
   */
  AuthenticatorNotFound = 'AuthenticatorNotFound',
  /**
   * Mfa factor is not registered on the server
   */
  FactorNotFound = 'FactorNotFound',
}

export enum AssociateError {
  /**
   * Mfa factor is not registered on the server
   */
  FactorNotFound = 'FactorNotFound',
}

export enum AssociateByMfaTokenError {
  /**
   * Will throw if mfa token validation failed.
   */
  InvalidMfaToken = 'InvalidMfaToken',
  /**
   * Mfa factor is not registered on the server
   */
  FactorNotFound = 'FactorNotFound',
}

export enum FindUserAuthenticatorsByMfaTokenError {
  /**
   * Will throw if mfa token validation failed.
   */
  InvalidMfaToken = 'InvalidMfaToken',
}
