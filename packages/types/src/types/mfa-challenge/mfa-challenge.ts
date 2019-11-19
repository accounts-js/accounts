export interface MfaChallenge {
  /**
   * Db id
   */
  id: string;
  /**
   * User id linked to this challenge
   */
  userId: string;
  /**
   * Authenticator that will be used to resolve this challenge
   */
  authenticatorId?: string;
  /**
   * Random token used to identify the challenge
   */
  token: string;
}
