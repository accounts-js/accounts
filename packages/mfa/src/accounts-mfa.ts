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
import {
  errors,
  AuthenticateErrors,
  ChallengeErrors,
  AssociateError,
  AssociateByMfaTokenError,
  FindUserAuthenticatorsByMfaTokenError,
} from './errors';

export interface AccountsMfaOptions {
  /**
   * Accounts mfa module errors
   */
  errors?: ErrorMessages;
  /**
   * Factors used for mfa
   */
  factors: { [key: string]: AuthenticatorService | undefined };
}

interface AccountsMfaAuthenticateParams {
  mfaToken: string;
}

const defaultOptions = {
  errors,
};

export class AccountsMfa<CustomUser extends User = User> implements AuthenticationService {
  public serviceName = 'mfa';
  public server!: AccountsServer;
  private options: AccountsMfaOptions & typeof defaultOptions;
  private db!: DatabaseInterface<CustomUser>;
  private factors: { [key: string]: AuthenticatorService | undefined };

  constructor(options: AccountsMfaOptions) {
    this.options = { ...defaultOptions, ...options };
    this.factors = options.factors;
  }

  public setStore(store: DatabaseInterface<CustomUser>) {
    this.db = store;
  }

  /**
   * @throws {@link AuthenticateErrors}
   */
  public async authenticate(
    params: AccountsMfaAuthenticateParams,
    infos: ConnectionInformations
  ): Promise<CustomUser | null> {
    const mfaToken = params.mfaToken;
    const mfaChallenge = mfaToken ? await this.db.findMfaChallengeByToken(mfaToken) : null;
    if (!mfaChallenge || !mfaChallenge.authenticatorId) {
      throw new AccountsJsError(
        this.options.errors.invalidMfaToken,
        AuthenticateErrors.InvalidMfaToken
      );
    }
    const authenticator = await this.db.findAuthenticatorById(mfaChallenge.authenticatorId);
    if (!authenticator) {
      throw new AccountsJsError(
        this.options.errors.invalidMfaToken,
        AuthenticateErrors.InvalidMfaToken
      );
    }
    const factor = this.factors[authenticator.type];
    if (!factor) {
      throw new AccountsJsError(
        this.options.errors.factorNotFound(authenticator.type),
        AuthenticateErrors.FactorNotFound
      );
    }
    // TODO we need to implement some time checking for the mfaToken (eg: expire after X minutes, probably based on the authenticator configuration)
    if (!(await factor.authenticate(mfaChallenge, authenticator, params, infos))) {
      // TODO custom error
      throw new Error(`Authenticator ${authenticator.type} was not able to authenticate user`);
    }
    // We activate the authenticator if user is using a challenge with scope 'associate'
    if (!authenticator.active && mfaChallenge.scope === 'associate') {
      await this.db.activateAuthenticator(authenticator.id);
    } else if (!authenticator.active) {
      // TODO custom error
      throw new Error('Authenticator is not active');
    }

    // We invalidate the current mfa challenge so it can't be reused later
    await this.db.deactivateMfaChallenge(mfaChallenge.id);

    return this.db.findUserById(mfaChallenge.userId);
  }
  /**
   * @description Request a challenge for the MFA authentication.
   * @param {string} mfaToken - A valid mfa token you obtained during the login process.
   * @param {string} authenticatorId - The ID of the authenticator to challenge.
   * @param {ConnectionInformations} infos - User connection informations.
   * @throws {@link ChallengeErrors}
   */
  public async challenge(
    mfaToken: string,
    authenticatorId: string,
    infos: ConnectionInformations
  ): Promise<any> {
    const [mfaChallenge, authenticator] = await Promise.all([
      mfaToken ? await this.db.findMfaChallengeByToken(mfaToken) : null,
      authenticatorId ? await this.db.findAuthenticatorById(authenticatorId) : null,
    ]);
    if (!mfaChallenge || !this.isMfaChallengeValid(mfaChallenge)) {
      throw new AccountsJsError(
        this.options.errors.invalidMfaToken,
        ChallengeErrors.InvalidMfaToken
      );
    }
    if (!authenticator) {
      throw new AccountsJsError(
        this.options.errors.authenticatorNotFound,
        ChallengeErrors.AuthenticatorNotFound
      );
    }
    // A user should be able to challenge only his own authenticators
    // This should never happen but it's just an extra check to be safe
    if (mfaChallenge.userId !== authenticator.userId) {
      throw new AccountsJsError(
        this.options.errors.invalidMfaToken,
        ChallengeErrors.InvalidMfaToken
      );
    }
    const factor = this.factors[authenticator.type];
    if (!factor) {
      throw new AccountsJsError(
        this.options.errors.factorNotFound(authenticator.type),
        ChallengeErrors.FactorNotFound
      );
    }
    // If authenticator do not have a challenge method, we attach the authenticator id to the challenge
    if (!factor.challenge) {
      await this.db.updateMfaChallenge(mfaChallenge.id, {
        authenticatorId: authenticator.id,
      });
      return {
        mfaToken: mfaChallenge.token,
        authenticatorId: authenticator.id,
      };
    }
    return factor.challenge(mfaChallenge, authenticator, infos);
  }

  /**
   * @description Start the association of a new authenticator.
   * @param {string} userId - User id to link the new authenticator.
   * @param {string} serviceName - Service name of the authenticator service.
   * @param {any} params - Params for the the authenticator service.
   * @param {ConnectionInformations} infos - User connection informations.
   * @throws {@link AssociateError}
   */
  public async associate(
    userId: string,
    factorName: string,
    params: any,
    infos: ConnectionInformations
  ): Promise<any> {
    const factor = this.factors[factorName];
    if (!factor) {
      throw new AccountsJsError(
        this.options.errors.factorNotFound(factorName),
        AssociateError.FactorNotFound
      );
    }

    return factor.associate(userId, params, infos);
  }

  /**
   * @description Start the association of a new authenticator, this method is called when the user is
   * enforced to associate an authenticator before the first login.
   * @param {string} userId - User id to link the new authenticator.
   * @param {string} serviceName - Service name of the authenticator service.
   * @param {any} params - Params for the the authenticator service.
   * @param {ConnectionInformations} infos - User connection informations.
   * @throws {@link AssociateByMfaTokenError}
   */
  public async associateByMfaToken(
    mfaToken: string,
    factorName: string,
    params: any,
    infos: ConnectionInformations
  ): Promise<any> {
    const factor = this.factors[factorName];
    if (!factor) {
      throw new AccountsJsError(
        this.options.errors.factorNotFound(factorName),
        AssociateByMfaTokenError.FactorNotFound
      );
    }
    const mfaChallenge = mfaToken ? await this.db.findMfaChallengeByToken(mfaToken) : null;
    if (
      !mfaChallenge ||
      !this.isMfaChallengeValid(mfaChallenge) ||
      mfaChallenge.scope !== 'associate'
    ) {
      throw new AccountsJsError(
        this.options.errors.invalidMfaToken,
        AssociateByMfaTokenError.InvalidMfaToken
      );
    }

    return factor.associate(mfaChallenge, params, infos);
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
        this.factors[authenticator.type]?.sanitize?.(authenticator) ?? authenticator
    );
  }

  /**
   * @description Return the list of the active authenticators for this user.
   * @param {string} mfaToken - A valid mfa token you obtained during the login process.
   * @throws {@link FindUserAuthenticatorsByMfaTokenError}
   */
  public async findUserAuthenticatorsByMfaToken(mfaToken: string): Promise<Authenticator[]> {
    const mfaChallenge = mfaToken ? await this.db.findMfaChallengeByToken(mfaToken) : null;
    if (!mfaChallenge || !this.isMfaChallengeValid(mfaChallenge)) {
      throw new AccountsJsError(
        this.options.errors.invalidMfaToken,
        FindUserAuthenticatorsByMfaTokenError.InvalidMfaToken
      );
    }
    const authenticators = await this.db.findUserAuthenticators(mfaChallenge.userId);
    return authenticators
      .filter((authenticator) => authenticator.active)
      .map(
        (authenticator) =>
          this.factors[authenticator.type]?.sanitize?.(authenticator) ?? authenticator
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
