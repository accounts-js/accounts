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
  /**
   * If active is true, contain the date when the authenticator was activated
   */
  activatedAt?: string;
}
