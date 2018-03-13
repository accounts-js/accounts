import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { error } from 'util';

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

  private validateConfiguration(config: Configuration): void {
    if (!config) {
      throw new Error('[ Accounts - TokenManager ] configuration : A configuration object is needed');
    }
    if (typeof config.secret !== 'string') {
      throw new Error('[ Accounts - TokenManager ] configuration : A string secret property is needed');
    }
  }
}
