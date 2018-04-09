import { Tokens } from '@accounts/types'

import { setCookie } from './utils/set-cookie';
import { getCookie } from './utils/get-cookie';

import { Configuration } from './types/configuration';
import { TokenConfiguration } from './types/token-configuration'

const defaultConfig: Configuration<TokenConfiguration> = {
  access: {
    name: 'accessToken',
    canStore: true,
    maxAge: 1*60*60*1000
  },
  refresh: {
    name: 'refreshToken',
    canStore: true,
    maxAge: 1*60*60*1000
  }
}

export default class ClientTokenTransportRestCookies {
	
	private accessConfig: TokenConfiguration;
	private refreshConfig: TokenConfiguration;

	constructor(config?: Partial<Configuration<Partial<TokenConfiguration>>>) {
    this.accessConfig = { ...defaultConfig.access, ...(config && config.access || {}) };
    this.refreshConfig = { ...defaultConfig.refresh, ...(config && config.refresh || {}) };
  }

  public setAccessToken(config: RequestInit, body: any, accessToken?: string): [RequestInit, any] {
    if(this.accessConfig.canStore && accessToken){
      setCookie(this.accessConfig.name, accessToken, this.accessConfig.maxAge)
    }
    return [config, body]
  }

  public setRefreshToken(config: RequestInit, body: any, refreshToken?: string): [RequestInit, any] {
    if(this.refreshConfig.canStore && refreshToken){
      setCookie(this.refreshConfig.name, refreshToken, this.refreshConfig.maxAge)
    }
    return [config, body]
  }

  public setTokens(config: RequestInit, body:any, tokens: Tokens): [RequestInit, any] {
    const { accessToken, refreshToken } = tokens;
    this.setAccessToken(config, body, accessToken);
    this.setRefreshToken(config, body, refreshToken);
    return [config, body]
	}
	
	public getAccessToken(): string | undefined {
		return getCookie(this.accessConfig.name) || undefined
	}

	public getRefreshToken(): string | undefined {
    return getCookie(this.refreshConfig.name) || undefined
	}

	public getTokens(): Tokens {
		return {
			accessToken: this.getAccessToken(),
			refreshToken: this.getRefreshToken()
		}
  }
}
