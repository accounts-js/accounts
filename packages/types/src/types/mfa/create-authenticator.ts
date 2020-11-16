export interface CreateAuthenticator {
  /**
   * Authenticator type
   */
  type: string;
  /**
   * User id linked to this authenticator
   */
  userId: string;
  /**
   * Is authenticator active
   */
  active: boolean;
  /**
   * Custom properties
   */
  [additionalKey: string]: any;
}
