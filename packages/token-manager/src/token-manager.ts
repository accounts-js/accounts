import { TokenRecord } from '@accounts/common';

import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { error } from 'util';

import { Configuration } from './types/configuration'
import { TokenGenerationConfiguration } from './types/token-generation-configuration';

const defaultTokenConfig: TokenGenerationConfiguration = {
  algorithm:'HS256',
}

const defaultAccessTokenConfig: TokenGenerationConfiguration = {
  expiresIn:'90m',
}

const defaultRefreshTokenConfig: TokenGenerationConfiguration = {
  expiresIn: '7d',
}

export default class TokenManager {
  
  private secret: string;
  private emailTokensExpiration: number;
  private accessTokenConfig: TokenGenerationConfiguration;
  private refreshTokenConfig: TokenGenerationConfiguration;

  constructor(config: Configuration){
    this.secret = config.secret;
    this.emailTokensExpiration = config.emailTokensExpiration || (1000*60);
    this.accessTokenConfig = { ...defaultTokenConfig, ...defaultAccessTokenConfig, ...config.access };
    this.refreshTokenConfig = { ...defaultTokenConfig, ...defaultRefreshTokenConfig, ...config.refresh };
  }

  public generateRandom(length: number | undefined = 43): string {
    return randomBytes(length).toString('hex')
  }

  public generateAccessToken(data): string {
    return jwt.sign(data, this.secret, this.accessTokenConfig);
  }

  public generateRefreshToken(data = {}): string {
    return jwt.sign(data, this.secret, this.refreshTokenConfig);
  }

  public isEmailTokenExpired( token: string, tokenRecord?: TokenRecord ): boolean {
    return !tokenRecord || Number(tokenRecord.when) + this.emailTokensExpiration < Date.now()
  }



  private validateConfiguration(config: Configuration): void {
    if(!config) {
      throw new Error('[ Accounts - TokenManager ] configuration : A configuration object is needed')
    }
    if(typeof config.secret === "string") {
      throw new Error('[ Accounts - TokenManager ] configuration : A string secret property is needed')
    }
    
  }

}