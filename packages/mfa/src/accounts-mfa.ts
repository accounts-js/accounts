import {
  AuthenticationService,
  User,
  DatabaseInterface,
  ConnectionInformations,
  AuthenticatorService,
  Authenticator,
  MfaChallenge,
} from '@accounts/types';
import { AccountsServer, AccountsJsError } from '@accounts/server';
import { ErrorMessages } from './types';
import { errors, ChallengeErrors } from './errors';

export interface AccountsMfaOptions {
  /**
   * Accounts mfa module errors
   */
  errors?: ErrorMessages;
}

const defaultOptions = {
  errors,
};

export class AccountsMfa<CustomUser extends User = User> implements AuthenticationService {
  public serviceName = 'mfa';
  public server!: AccountsServer;
  private options: AccountsMfaOptions & typeof defaultOptions;
  private db!: DatabaseInterface<CustomUser>;
  private authenticators: { [key: string]: AuthenticatorService };

  constructor(
    options: AccountsMfaOptions = {},
    authenticators?: { [key: string]: AuthenticatorService }
  ) {
    this.options = { ...defaultOptions, ...options };
    this.authenticators = authenticators || {};
  }

  public setStore(store: DatabaseInterface<CustomUser>) {
    this.db = store;
  }

  public async authenticate(): Promise<CustomUser> {
    // TODO
    throw new Error('Not implemented');
  }
  /**
   * @description Request a challenge for the MFA authentication.
   * @param {string} mfaToken - A valid mfa token you obtained during the login process.
   * @param {string} authenticatorId - The ID of the authenticator to challenge.
   * @param {ConnectionInformations} infos - User connection informations.
   */
  public async challenge(
    mfaToken: string,
    authenticatorId: string,
    infos: ConnectionInformations
  ): Promise<any> {
    if (!mfaToken) {
      throw new AccountsJsError(
        this.options.errors.invalidMfaToken,
        ChallengeErrors.InvalidMfaToken
      );
    }
    if (!authenticatorId) {
      throw new AccountsJsError(
        this.options.errors.invalidAuthenticatorId,
        ChallengeErrors.InvalidAuthenticatorId
      );
    }
    const mfaChallenge = await this.db.findMfaChallengeByToken(mfaToken);
    if (!mfaChallenge || !this.isMfaChallengeValid(mfaChallenge)) {
      throw new AccountsJsError(
        this.options.errors.invalidMfaToken,
        ChallengeErrors.InvalidMfaToken
      );
    }
    const authenticator = await this.db.findAuthenticatorById(authenticatorId);
    if (!authenticator) {
      throw new AccountsJsError(
        this.options.errors.authenticatorNotFound,
        ChallengeErrors.AuthenticatorNotFound
      );
    }
    // A user should be able to challenge only his own authenticators
    if (mfaChallenge.userId !== authenticator.userId) {
      throw new AccountsJsError(
        this.options.errors.invalidMfaToken,
        ChallengeErrors.InvalidMfaToken
      );
    }
    const authenticatorService = this.authenticators[authenticator.type];
    if (!authenticatorService) {
      // TODO custom error
      throw new Error(`No authenticator with the name ${authenticator.type} was registered.`);
    }
    // If authenticator do not have a challenge method, we attach the authenticator id to the challenge
    if (!authenticatorService.challenge) {
      await this.db.updateMfaChallenge(mfaChallenge.id, {
        authenticatorId: authenticator.id,
      });
      return {
        mfaToken: mfaChallenge.token,
        authenticatorId: authenticator.id,
      };
    }
    return authenticatorService.challenge(mfaChallenge, authenticator, infos);
  }

  /**
   * @description Start the association of a new authenticator.
   * @param {string} userId - User id to link the new authenticator.
   * @param {string} serviceName - Service name of the authenticator service.
   * @param {any} params - Params for the the authenticator service.
   * @param {ConnectionInformations} infos - User connection informations.
   */
  public async associate(
    userId: string,
    serviceName: string,
    params: any,
    infos: ConnectionInformations
  ): Promise<any> {
    if (!this.authenticators[serviceName]) {
      // TODO custom error
      throw new Error(`No authenticator with the name ${serviceName} was registered.`);
    }

    const associate = await this.authenticators[serviceName].associate(userId, params, infos);
    return associate;
  }

  /**
   * @description Start the association of a new authenticator, this method is called when the user is
   * enforced to associate an authenticator before the first login.
   * @param {string} userId - User id to link the new authenticator.
   * @param {string} serviceName - Service name of the authenticator service.
   * @param {any} params - Params for the the authenticator service.
   * @param {ConnectionInformations} infos - User connection informations.
   */
  public async associateByMfaToken(
    mfaToken: string,
    serviceName: string,
    params: any,
    infos: ConnectionInformations
  ): Promise<any> {
    if (!this.authenticators[serviceName]) {
      // TODO custom error
      throw new Error(`No authenticator with the name ${serviceName} was registered.`);
    }
    if (!mfaToken) {
      throw new Error('Mfa token invalid');
    }
    const mfaChallenge = await this.db.findMfaChallengeByToken(mfaToken);
    if (
      !mfaChallenge ||
      !this.isMfaChallengeValid(mfaChallenge) ||
      mfaChallenge.scope !== 'associate'
    ) {
      throw new Error('Mfa token invalid');
    }

    const associate = await this.authenticators[serviceName].associate(mfaChallenge, params, infos);
    return associate;
  }

  /**
   * @description Return the list of the active and inactive authenticators for this user.
   * The authenticators objects are whitelisted to not expose any sensitive informations to the client.
   * If you want to get all the fields from the database, use the database `findUserAuthenticators` method directly.
   * @param {string} userId - User id linked to the authenticators.
   */
  public async findUserAuthenticators(userId: string): Promise<Authenticator[]> {
    const authenticators = await this.db.findUserAuthenticators(userId);
    return authenticators.map(
      (authenticator) =>
        this.authenticators[authenticator.type]?.sanitize?.(authenticator) ?? authenticator
    );
  }

  /**
   * @description Return the list of the active authenticators for this user.
   * @param {string} mfaToken - A valid mfa token you obtained during the login process.
   */
  public async findUserAuthenticatorsByMfaToken(mfaToken: string): Promise<Authenticator[]> {
    if (!mfaToken) {
      // TODO custom error
      throw new Error('Mfa token invalid');
    }
    const mfaChallenge = await this.db.findMfaChallengeByToken(mfaToken);
    if (!mfaChallenge || !this.isMfaChallengeValid(mfaChallenge)) {
      // TODO custom error
      throw new Error('Mfa token invalid');
    }
    const authenticators = await this.db.findUserAuthenticators(mfaChallenge.userId);
    return authenticators
      .filter((authenticator) => authenticator.active)
      .map(
        (authenticator) =>
          this.authenticators[authenticator.type]?.sanitize?.(authenticator) ?? authenticator
      );
  }

  public isMfaChallengeValid(mfaChallenge: MfaChallenge): boolean {
    // TODO need to check that the challenge is not expired
    if (mfaChallenge.deactivated) {
      return false;
    }
    return true;
  }
}
