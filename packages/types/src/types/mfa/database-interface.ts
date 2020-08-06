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
   * Activate the authenticator by his id.
   */
  activateAuthenticator(authenticatorId: string): Promise<void>;

  /**
   * Deactivate the authenticator by his id.
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
   * Deactivate the mfa challenge by his id.
   */
  deactivateMfaChallenge(mfaChallengeId: string): Promise<void>;
}
