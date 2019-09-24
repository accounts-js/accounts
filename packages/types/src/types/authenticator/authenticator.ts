export interface Authenticator {
  /**
   * Db id
   */
  id: string;
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
}
