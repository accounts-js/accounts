import { Tokens, TokenTransport } from '@accounts/types';

import { Configuration } from './types/configuration';
import { TokenConfiguration } from './types/token-configuration';

const defaultConfig: Configuration = {
  access: {
    canStore: () => true,
    name: 'accessToken',
    httpOnly: true,
		secure: true,
		expires: new Date( new Date().getTime() + (1000*60*20)),
		maxAge: 1000*60*20,
		domain: false,
		path: '/',
		sameSite: 'Strict'
  },
  refresh: {
    canStore: () => true,
    name: 'refreshToken',
    httpOnly: true,
		secure: true,
		expires: new Date( new Date().getTime() + (1000*60*20)),
		maxAge: 1000*60*20,
		domain: false,
		path: '/',
		sameSite: 'Strict'
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
    const { name, canStore, ...accessConfig } = this.accessConfig;
    if (canStore(req)) {
      res.cookie(name, accessToken, accessConfig)
    }
  }

  public setRefreshToken(refreshToken: string, { req, res }: any): void {
    const { name, canStore, ...refreshConfig } = this.refreshConfig;
    if (canStore(req)) {
		  res.cookie(name, refreshToken, refreshConfig)
    }
  }

  public setTokens({ accessToken, refreshToken }: Tokens, tokenContainer: any): void {
    this.setAccessToken(accessToken, tokenContainer);
    this.setRefreshToken(refreshToken, tokenContainer);
  }

  public getAccessToken(req: any): string | undefined {
    return req.cookies[this.accessConfig.name]
  }

  public getRefreshToken(req: any): string | undefined {
    return req.cookies[this.refreshConfig.name]
  }

  public getTokens(req: any): Tokens {
    return {
      accessToken: this.getAccessToken(req),
      refreshToken: this.getRefreshToken(req),
    };
  }

  public removeAccessToken(res: any): void {
    const { name, canStore, ...accessConfig } = this.accessConfig;
		res.clearCookie(name, accessConfig);
  }

  public removeRefreshToken(res: any): void {
    const { name, canStore, ...refreshConfig } = this.refreshConfig;
		res.clearCookie(name, refreshConfig);
  }

  public removeTokens(res): void {
    this.removeAccessToken(res)
		this.removeRefreshToken(res)
  }
}
