import * as speakeasy from 'speakeasy';
import { User, DatabaseInterface } from '@accounts/types';
import { errors } from './errors';
import { AccountsTwoFactorOptions } from './types';
import { getUserTwoFactorService } from './utils';

const defaultOptions = {
  secretLength: 20,
  window: 0,
  errors,
};

export class TwoFactor {
  private options: AccountsTwoFactorOptions & typeof defaultOptions;
  private db!: DatabaseInterface;
  private serviceName = 'two-factor';

  constructor(options: AccountsTwoFactorOptions = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Set two factor store
   */
  public setStore(store: DatabaseInterface): void {
    this.db = store;
  }

  /**
   * Authenticate a user with a 2fa code
   */
  public async authenticate(user: User, code: string): Promise<void> {
    if (!code) {
      throw new Error(this.options.errors.codeRequired);
    }

    const twoFactorService = getUserTwoFactorService(user);
    // If user does not have 2fa set return error
    if (!twoFactorService) {
      throw new Error(this.options.errors.userTwoFactorNotSet);
    }
    if (
      !speakeasy.totp.verify({
        secret: twoFactorService.secret.base32,
        encoding: 'base32',
        token: code,
        window: this.options.window,
      })
    ) {
      throw new Error(this.options.errors.codeDidNotMatch);
    }
  }

  /**
   * Generate a new two factor secret
   */
  public getNewAuthSecret(): speakeasy.Key {
    return speakeasy.generateSecret({
      length: this.options.secretLength,
      name: this.options.appName,
    });
  }

  /**
   * Verify the code is correct
   * Add the code to the user profile
   * Throw if user already have 2fa enabled
   */
  public async set(userId: string, secret: speakeasy.Key, code: string): Promise<void> {
    if (!code) {
      throw new Error(this.options.errors.codeRequired);
    }

    const user = await this.db.findUserById(userId);
    if (!user) {
      throw new Error(this.options.errors.userNotFound);
    }
    let twoFactorService = getUserTwoFactorService(user);
    // If user already have 2fa return error
    if (twoFactorService) {
      throw new Error(this.options.errors.userTwoFactorAlreadySet);
    }

    if (
      speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token: code,
        window: this.options.window,
      })
    ) {
      twoFactorService = {
        secret,
      };
      await this.db.setService(userId, this.serviceName, twoFactorService);
    } else {
      throw new Error(this.options.errors.codeDidNotMatch);
    }
  }

  /**
   * Remove two factor for a user
   */
  public async unset(userId: string, code: string): Promise<void> {
    if (!code) {
      throw new Error(this.options.errors.codeRequired);
    }

    const user = await this.db.findUserById(userId);
    if (!user) {
      throw new Error(this.options.errors.userNotFound);
    }
    const twoFactorService = getUserTwoFactorService(user);
    // If user does not have 2fa set return error
    if (!twoFactorService) {
      throw new Error(this.options.errors.userTwoFactorNotSet);
    }
    if (
      speakeasy.totp.verify({
        secret: twoFactorService.secret.base32,
        encoding: 'base32',
        token: code,
        window: this.options.window,
      })
    ) {
      this.db.unsetService(userId, this.serviceName);
    } else {
      throw new Error(this.options.errors.codeDidNotMatch);
    }
  }
}
