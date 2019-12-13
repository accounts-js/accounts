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
  /**
   * If scope is set to associate, the authenticate function will verify the authenticator next time the user call it
   */
  scope?: 'associate';
  /**
   * If deactivated is set to true, it means that challenge was already used and can't be used anymore
   */
  deactivated: boolean;
  /**
   * If deactivated is true, contain the date when the challenge was used
   */
  deactivatedAt?: string;
}
