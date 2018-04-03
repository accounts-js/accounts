import { TokenRecord } from '@accounts/types';
import AccountsError from '@accounts/error';

import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';

import { Configuration } from './types/configuration';
import { TokenGenerationConfiguration } from './types/token-generation-configuration';

const defaultTokenConfig: TokenGenerationConfiguration = {
  algorithm: 'HS256',
};

const defaultAccessTokenConfig: TokenGenerationConfiguration = {
  expiresIn: '90m',
};

const defaultRefreshTokenConfig: TokenGenerationConfiguration = {
  expiresIn: '7d',
};

export default class TokenManager {

  private secret: string;

  private emailTokenExpiration: number;

  private accessTokenConfig: TokenGenerationConfiguration;

  private refreshTokenConfig: TokenGenerationConfiguration;

  constructor(config: Configuration) {
    this.validateConfiguration(config);
    this.secret = config.secret;
    this.emailTokenExpiration = config.emailTokenExpiration || 1000 * 60;
    this.accessTokenConfig = { ...defaultTokenConfig, ...defaultAccessTokenConfig, ...config.access };
    this.refreshTokenConfig = { ...defaultTokenConfig, ...defaultRefreshTokenConfig, ...config.refresh };
  }

  public generateRandomToken(length: number | undefined): string {
    return randomBytes(length || 43).toString('hex');
  }

  public generateAccessToken(data): string {
    return jwt.sign({ data }, this.secret, this.accessTokenConfig);
  }

  public generateRefreshToken(data = {}): string {
    return jwt.sign({ data }, this.secret, this.refreshTokenConfig);
  }

  public isEmailTokenExpired(token: string, tokenRecord?: TokenRecord): boolean {
    return !tokenRecord || Number(tokenRecord.when) + this.emailTokenExpiration < Date.now();
  }

  public decodeToken(token: string, ignoreExpiration: boolean = false): string | object {
    return jwt.verify(token, this.secret, { ignoreExpiration });
  }

  private validateConfiguration(config: Configuration): void {
    if (!config) {
      throw new AccountsError('TokenManager', 'configuration', 'A configuration object is needed');
    }
    if (typeof config.secret !== 'string') {
      throw new AccountsError('TokenManager', 'configuration', 'A string secret property is needed');
    }
  }
}
