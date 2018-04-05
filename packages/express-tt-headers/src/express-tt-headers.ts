import { Tokens, TokenTransport } from '@accounts/types';

import { Configuration } from './types/configuration';
import { TokenConfiguration } from './types/token-configuration';

const defaultConfig: Configuration = {
  access: {
    canStore: () => true,
    name: 'accessToken',
  },
  refresh: {
    canStore: () => true,
    name: 'refreshToken',
  },
};

export default class ExpressTokenTransportHeaders implements TokenTransport {
  public accessConfig: TokenConfiguration;
  public refreshConfig: TokenConfiguration;

  constructor(config?: Configuration) {
    this.accessConfig = { ...defaultConfig.access, ...((config && config.access) || {}) };
    this.refreshConfig = { ...defaultConfig.refresh, ...((config && config.refresh) || {}) };
  }

  public setAccessToken(accessToken: string, { req, res }: any): void {
    if (this.accessConfig.canStore(req)) {
      res.set(this.accessConfig.name, accessToken);
    }
  }

  public setRefreshToken(refreshToken: string, { req, res }: any): void {
    if (this.refreshConfig.canStore(req)) {
      res.set(this.refreshConfig.name, refreshToken);
    }
  }

  public setTokens({ accessToken, refreshToken }: Tokens, tokenContainer: any): void {
    this.setAccessToken(accessToken, tokenContainer);
    this.setRefreshToken(refreshToken, tokenContainer);
  }

  public getAccessToken(req: any): string | undefined {
    return req.get(this.accessConfig.name);
  }

  public getRefreshToken(req: any): string | undefined {
    return req.get(this.refreshConfig.name);
  }

  public getTokens(req: any): Tokens {
    return {
      accessToken: this.getAccessToken(req),
      refreshToken: this.getRefreshToken(req),
    };
  }

  public removeAccessToken(): void {
    return;
  }

  public removeRefreshToken(): void {
    return;
  }

  public removeTokens(): void {
    return;
  }
}
