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

}
