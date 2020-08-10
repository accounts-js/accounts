export interface ErrorMessages {
  /**
   * Default to 'Invalid mfa token'.
   */
  invalidMfaToken: string;
  /**
   * Default to 'Invalid authenticator id'.
   */
  invalidAuthenticatorId: string;
  /**
   * Default to 'Authenticator not found'.
   */
  authenticatorNotFound: string;
  /**
   *  Default to 'Authenticator is not active'.
   */
  authenticatorNotActive: string;
  /**
   * Default to 'No service with the name ${factorName} was registered.'.
   */
  factorNotFound: (factorName: string) => string;
  /**
   * Default to 'Authenticator ${authenticator.type} was not able to authenticate user.'.
   */
  authenticationFailed: (factorName: string) => string;
}
