import { CreateAuthenticator } from './create-authenticator';
import { Authenticator } from './authenticator';
import { MfaChallenge } from './mfa-challenge';
import { CreateMfaChallenge } from './create-mfa-challenge';

export interface DatabaseInterfaceMfa {
  /**
   * Create a new authenticator for the user.
   */
  createAuthenticator(authenticator: CreateAuthenticator): Promise<string>;

  /**
   * Find an authenticator by his id.
   */
  findAuthenticatorById(authenticatorId: string): Promise<Authenticator | null>;

  /**
   * Return all the authenticators of the user.
   */
  findUserAuthenticators(userId: string): Promise<Authenticator[]>;

  /**
   * TODO Do we really need this one as the update one could work for this?
   */
  activateAuthenticator(authenticatorId: string): Promise<void>;

  /**
   * TODO Do we really need this one as the update one could work for this?
   */
  deactivateAuthenticator(authenticatorId: string): Promise<void>;

  /**
   * Update the authenticator.
   */
  updateAuthenticator(authenticatorId: string, data: Partial<Authenticator>): Promise<void>;

  /**
   * Create a new mfa challenge for the user.
   */
  createMfaChallenge(newMfaChallenge: CreateMfaChallenge): Promise<string>;

  /**
   * Find the mfa challenge by his id.
   */
  findMfaChallengeByToken(token: string): Promise<MfaChallenge | null>;

  /**
   * Update the mfa challenge.
   */
  updateMfaChallenge(mfaChallengeId: string, data: Partial<MfaChallenge>): Promise<void>;

  /**
   * TODO Do we really need this one as the update one could work for this?
   */
  deactivateMfaChallenge(mfaChallengeId: string): Promise<void>;
}
