import * as speakeasy from 'speakeasy';
import { DBInterface } from '@accounts/server';
import { UserObjectType } from '@accounts/common';

import { Configuration } from './types/configuration'
import { TwoFactorService } from './types/two-factor-service'

import { errors } from './utils/errors';

const defaultConfig = {
  secretLength: 20,
  window: 0,
};

export default class TwoFactor {
  private config: Configuration;
  private db: DBInterface;
  private serviceName = 'two-factor';

  constructor(config: Configuration = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Set two factor store
   */
  public setStore(store: DBInterface): void {
    this.db = store;
  }

  /**
   * Return the user two factor service object
   */
  public getUserService = (user: UserObjectType): TwoFactorService => {
    return user.services[this.serviceName];
  };

  /**
   * Authenticate a user with a 2fa code
   */
  public async authenticate(user: UserObjectType, code: string): Promise<void> {
    if (!code) {
      throw new Error(errors.codeRequired);
    }

    const twoFactorService = this.getUserService(user);
    // If user does not have 2fa set return error
    if (!twoFactorService) {
      throw new Error(errors.userTwoFactorNotSet);
    }
    if (
      !speakeasy.totp.verify({
        secret: twoFactorService.secret.base32,
        encoding: 'base32',
        token: code,
        window: this.config.window,
      })
    ) {
      throw new Error(errors.codeDidNotMatch);
    }
  }

  /**
   * Generate a new two factor secret
   */
  public getNewAuthSecret(): speakeasy.Key {
    return speakeasy.generateSecret({
      length: this.config.secretLength,
      name: this.config.appName,
    });
  }

  /**
   * Verify the code is correct
   * Add the code to the user profile
   */
  public async set(
    userId: string,
    secret: speakeasy.Key,
    code: string
  ): Promise<void> {
    if (!code) {
      throw new Error(errors.codeRequired);
    }
    if (
      speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token: code,
        window: this.config.window,
      })
    ) {
      const twoFactorService: TwoFactorService = {
        secret,
      };
      await this.db.setService(userId, this.serviceName, twoFactorService);
    } else {
      throw new Error(errors.codeDidNotMatch);
    }
  }

  /**
   * Remove two factor for a user
   */
  public async unset(userId: string, code: string): Promise<void> {
    if (!code) {
      throw new Error(errors.codeRequired);
    }

    const user = await this.db.findUserById(userId);
    const twoFactorService = this.getUserService(user);
    // If user does not have 2fa set return error
    if (!twoFactorService) {
      throw new Error(errors.userTwoFactorNotSet);
    }
    if (
      speakeasy.totp.verify({
        secret: twoFactorService.secret.base32,
        encoding: 'base32',
        token: code,
        window: this.config.window,
      })
    ) {
      this.db.unsetService(userId, this.serviceName);
    } else {
      throw new Error(errors.codeDidNotMatch);
    }
  }
}
