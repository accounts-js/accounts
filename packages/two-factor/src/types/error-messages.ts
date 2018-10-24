export interface ErrorMessages {
  /**
   * Default to 'User not found'
   */
  userNotFound: string;
  /**
   * Default to '2FA code didn't match'
   */
  codeDidNotMatch: string;
  /**
   * Default to '2FA not set'
   */
  userTwoFactorNotSet: string;
  /**
   * Default to '2FA already set'
   */
  userTwoFactorAlreadySet: string;
  /**
   * Default to '2FA code required'
   */
  codeRequired: string;
}
