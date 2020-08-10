import {
  DatabaseInterface,
  AuthenticatorService,
  Authenticator,
  MfaChallenge,
} from '@accounts/types';
import { AccountsServer, generateRandomToken } from '@accounts/server';
import { authenticator as optlibAuthenticator } from 'otplib';

interface DbAuthenticatorOtp extends Authenticator {
  secret: string;
}

export interface FactorOtpOptions {
  /**
   * Tokens in the previous and future x-windows that should be considered valid.
   */
  window?: number;
}

const defaultOptions = {
  window: 0,
};

export class FactorOtp implements AuthenticatorService {
  public authenticatorName = 'otp';
  public server!: AccountsServer;

  private options: FactorOtpOptions & typeof defaultOptions;
  private db!: DatabaseInterface;

  constructor(options: FactorOtpOptions = {}) {
    this.options = { ...defaultOptions, ...options };
    optlibAuthenticator.options = { window: this.options.window };
  }

  public setStore(store: DatabaseInterface) {
    this.db = store;
  }

  /**
   * @description Start the association of a new OTP device
   */
  public async associate(
    userIdOrMfaChallenge: string | MfaChallenge
  ): Promise<{ id: string; mfaToken: string; secret: string }> {
    const userId =
      typeof userIdOrMfaChallenge === 'string' ? userIdOrMfaChallenge : userIdOrMfaChallenge.userId;
    const mfaChallenge = typeof userIdOrMfaChallenge === 'string' ? null : userIdOrMfaChallenge;

    const secret = optlibAuthenticator.generateSecret();

    // TODO update pending (not active) authenticator if there is one

    const authenticatorId = await this.db.createAuthenticator({
      type: this.authenticatorName,
      userId,
      secret,
      active: false,
    });

    let mfaToken: string;
    if (mfaChallenge) {
      mfaToken = mfaChallenge.token;
      await this.db.updateMfaChallenge(mfaChallenge.id, {
        authenticatorId,
      });
    } else {
      // We create a new challenge for the authenticator so it can be verified later
      mfaToken = generateRandomToken();
      await this.db.createMfaChallenge({
        userId,
        authenticatorId,
        token: mfaToken,
        scope: 'associate',
      });
    }

    return {
      id: authenticatorId,
      mfaToken,
      secret,
    };
  }

  /**
   * @description Verify that the code provided by the user is valid
   */
  public async authenticate(
    mfaChallenge: MfaChallenge,
    authenticator: DbAuthenticatorOtp,
    { code }: { code?: string }
  ): Promise<boolean> {
    if (!code) {
      throw new Error('Code required');
    }

    return optlibAuthenticator.check(code, authenticator.secret);
  }

  /**
   * @description Remove the sensitive fields from the database authenticator. The object
   * returned by this function can be exposed to the user safely.
   */
  public sanitize(authenticator: DbAuthenticatorOtp): Authenticator {
    // The secret key should never be exposed to the user after the authenticator is linked
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      secret,
      ...safeAuthenticator
    } = authenticator;
    return safeAuthenticator;
  }
}
