export enum AuthenticateWithServiceErrors {
  /**
   * Service is not registered on the server
   */
  ServiceNotFound = 'ServiceNotFound',
  /**
   * User is deactivated, so not allowed to login
   */
  UserDeactivated = 'UserDeactivated',
  /**
   * Service failed to authenticate the user
   */
  AuthenticationFailed = 'AuthenticationFailed',
}

export enum LoginWithServiceErrors {
  /**
   * Service is not registered on the server
   */
  ServiceNotFound = 'ServiceNotFound',
  /**
   * User is deactivated, so not allowed to login
   */
  UserDeactivated = 'UserDeactivated',
  /**
   * Service failed to authenticate the user
   */
  AuthenticationFailed = 'AuthenticationFailed',
}

export enum ImpersonateErrors {
  /**
   * Will throw if user is not found.
   */
  UserNotFound = 'UserNotFound',
  /**
   * Session is not valid
   */
  InvalidSession = 'InvalidSession',
  /**
   * Impersonated user not found
   * If option `ambiguousErrorMessages` is true, this will never throw.
   */
  ImpersonatedUserNotFound = 'ImpersonatedUserNotFound',
  // Thrown by FindSessionByAccessTokenErrors
  /**
   * Will throw if access token is missing.
   */
  InvalidToken = 'InvalidToken',
  /**
   * Will throw if verification of the access token failed.
   */
  TokenVerificationFailed = 'TokenVerificationFailed',
  /**
   * Will throw if session is not found.
   */
  SessionNotFound = 'SessionNotFound',
}

export enum RefreshTokensErrors {
  /**
   * Will throw if access or refresh token are missing.
   */
  InvalidTokens = 'InvalidTokens',
  /**
   * Will throw if verification of the access token or refresh token failed.
   */
  TokenVerificationFailed = 'TokenVerificationFailed',
  /**
   * Will throw if session is not found.
   */
  SessionNotFound = 'SessionNotFound',
  /**
   * Will throw if user is not found.
   */
  UserNotFound = 'UserNotFound',
  /**
   * Session is not valid
   */
  InvalidSession = 'InvalidSession',
}

export enum LogoutErrors {
  /**
   * Session is not valid
   */
  InvalidSession = 'InvalidSession',
  // Thrown by FindSessionByAccessTokenErrors
  /**
   * Will throw if access token is missing.
   */
  InvalidToken = 'InvalidToken',
  /**
   * Will throw if verification of the access token failed.
   */
  TokenVerificationFailed = 'TokenVerificationFailed',
  /**
   * Will throw if session is not found.
   */
  SessionNotFound = 'SessionNotFound',
}

export enum FindSessionByAccessTokenErrors {
  /**
   * Will throw if access token is missing.
   */
  InvalidToken = 'InvalidToken',
  /**
   * Will throw if verification of the access token failed.
   */
  TokenVerificationFailed = 'TokenVerificationFailed',
  /**
   * Will throw if session is not found.
   */
  SessionNotFound = 'SessionNotFound',
}

export enum ResumeSessionErrors {
  /**
   * Will throw if user is not found.
   */
  UserNotFound = 'UserNotFound',
  /**
   * Session is not valid
   */
  InvalidSession = 'InvalidSession',
  // Thrown by FindSessionByAccessTokenErrors
  /**
   * Will throw if access token is missing.
   */
  InvalidToken = 'InvalidToken',
  /**
   * Will throw if verification of the access token failed.
   */
  TokenVerificationFailed = 'TokenVerificationFailed',
  /**
   * Will throw if session is not found.
   */
  SessionNotFound = 'SessionNotFound',
}
