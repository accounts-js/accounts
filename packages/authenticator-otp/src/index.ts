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

export interface AuthenticatorOtpOptions {
  /**
   * Two factor app name that will be displayed inside the user authenticator app.
   */
  appName?: string;

  /**
   * Two factor user name that will be displayed inside the user authenticator app,
   * usually a name, email etc..
   * Will be called every time a user register a new device.
   * That way you can display something like "Github (leo@accountsjs.com)" in the authenticator app.
   */
  userName?: (userId: string) => Promise<string> | string;
}

const defaultOptions = {
  appName: 'accounts-js',
};

export class AuthenticatorOtp implements AuthenticatorService {
  public serviceName = 'otp';
  public server!: AccountsServer;

  private options: AuthenticatorOtpOptions & typeof defaultOptions;
  private db!: DatabaseInterface;

  constructor(options: AuthenticatorOtpOptions = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  public setStore(store: DatabaseInterface) {
    this.db = store;
  }

  /**
   * @description Start the association of a new OTP device
   */
  public async associate(
    userIdOrMfaChallenge: string | MfaChallenge
  ): Promise<{ id: string; mfaToken: string; secret: string; otpauthUri: string }> {
    const userId =
      typeof userIdOrMfaChallenge === 'string' ? userIdOrMfaChallenge : userIdOrMfaChallenge.userId;
    const mfaChallenge = typeof userIdOrMfaChallenge === 'string' ? null : userIdOrMfaChallenge;

    const secret = optlibAuthenticator.generateSecret();
    const userName = this.options.userName ? await this.options.userName(userId) : userId;
    const otpauthUri = optlibAuthenticator.keyuri(userName, this.options.appName, secret);

    const authenticatorId = await this.db.createAuthenticator({
      type: this.serviceName,
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
      // associate.id refer to the authenticator id
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
      otpauthUri,
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
