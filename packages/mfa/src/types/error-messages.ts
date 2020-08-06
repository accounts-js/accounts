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
   * Default to 'Authenticator not found'.
   */
  factorNotFound: (factorName: string) => string;
}
