export interface CreateMfaChallenge {
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
   * Custom properties
   */
  [additionalKey: string]: any;
}
