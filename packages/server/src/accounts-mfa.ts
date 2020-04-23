import { DatabaseInterface, Authenticator, AuthenticatorService } from '@accounts/types';
import { generateRandomToken } from './utils/tokens';

export class AccountsMFA {
  private db: DatabaseInterface;
  private authenticators: { [key: string]: AuthenticatorService };

  constructor(db: DatabaseInterface, authenticators?: { [key: string]: AuthenticatorService }) {
    this.db = db;
    this.authenticators = authenticators || {};
  }

  /**
   * @description Request a challenge for the MFA authentication
   * @param {string} mfaToken - A valid mfa token you obtained during the login process.
   * @param {string} authenticatorId - The ID of the authenticator to challenge.
   */
  public async challenge(mfaToken: string, authenticatorId: string): Promise<void> {
    if (!mfaToken) {
      throw new Error('Mfa token invalid');
    }
    if (!authenticatorId) {
      throw new Error('Authenticator id invalid');
    }
    const mfaChallenge = await this.db.findMfaChallengeByToken(mfaToken);
    // TODO need to check that the challenge is not expired
    if (!mfaChallenge || mfaChallenge.deactivated) {
      throw new Error('Mfa token invalid');
    }
    const authenticator = await this.db.findAuthenticatorById(authenticatorId);
    if (!authenticator) {
      throw new Error('Authenticator not found');
    }
    // A user should be able to challenge only is own authenticators
    if (mfaChallenge.userId !== authenticator.userId) {
      throw new Error('Mfa token invalid');
    }
    const authenticatorService = this.authenticators[authenticator.type];
    if (!authenticatorService) {
      throw new Error(`No authenticator with the name ${authenticator.type} was registered.`);
    }
    // We trigger the good authenticator challenge
    if (authenticatorService.challenge) {
      await authenticatorService.challenge(mfaChallenge, authenticator);
    }
    // Then we attach the authenticator id that will be used to resolve the challenge
    await this.db.updateMfaChallenge(mfaChallenge.id, {
      authenticatorId: authenticator.id,
    });
  }

  /**
   * @description Start the association of a new authenticator
   * @param {string} userId - User id to link the new authenticator.
   * @param {string} serviceName - Service name of the authenticator service.
   * @param {any} params - Params for the the authenticator service.
   */
  public async associate(userId: string, serviceName: string, params: any): Promise<any> {
    if (!this.authenticators[serviceName]) {
      throw new Error(`No authenticator with the name ${serviceName} was registered.`);
    }

    const associate = await this.authenticators[serviceName].associate(userId, params);

    // We create a new challenge for the authenticator so it can be verified later
    const mfaChallengeToken = generateRandomToken();
    // associate.id refer to the authenticator id
    await this.db.createMfaChallenge({
      userId,
      authenticatorId: associate.id,
      token: mfaChallengeToken,
      scope: 'associate',
    });

    return {
      ...associate,
      mfaToken: mfaChallengeToken,
    };
  }

  /**
   * @description Return the list of the active and inactive authenticators for this user.
   * The authenticators objects are whitelisted to not expose any sensitive informations to the client.
   * If you want to get all the fields from the database, use the database `findUserAuthenticators` method directly.
   * @param {string} userId - User id linked to the authenticators.
   */
  public async findUserAuthenticators(userId: string): Promise<Authenticator[]> {
    const authenticators = await this.db.findUserAuthenticators(userId);
    return authenticators.map((authenticator) => {
      const authenticatorService = this.authenticators[authenticator.type];
      if (authenticatorService?.sanitize) {
        return authenticatorService.sanitize(authenticator);
      }
      return authenticator;
    });
  }

  /**
   * @description Return the list of the active authenticators for this user.
   * @param {string} mfaToken - A valid mfa token you obtained during the login process.
   */
  public async findUserAuthenticatorsByMfaToken(mfaToken: string): Promise<Authenticator[]> {
    if (!mfaToken) {
      throw new Error('Mfa token invalid');
    }
    const mfaChallenge = await this.db.findMfaChallengeByToken(mfaToken);
    // TODO need to check that the challenge is not expired
    if (!mfaChallenge || mfaChallenge.deactivated) {
      throw new Error('Mfa token invalid');
    }
    const authenticators = await this.db.findUserAuthenticators(mfaChallenge.userId);
    return authenticators
      .filter((authenticator) => authenticator.active)
      .map((authenticator) => {
        const authenticatorService = this.authenticators[authenticator.type];
        if (authenticatorService?.sanitize) {
          return authenticatorService.sanitize(authenticator);
        }
        return authenticator;
      });
  }
}
