import { Tokens } from '@accounts/types';
import { Configuration } from './types/configuration';
import { TokenConfiguration } from './types/token-configuration';

const defaultConfig: Configuration<TokenConfiguration> = {
  access: {
    name: 'accessToken',
    canStore: true,
  },
  refresh: {
    name: 'refreshToken',
    canStore: true
  }
}

export default class ClientRestTTHeaders {
	
	private accessConfig: TokenConfiguration;
	private refreshConfig: TokenConfiguration;

	constructor(config?: Partial<Configuration<Partial<TokenConfiguration>>>) {
    this.accessConfig = { ...defaultConfig.access, ...(config && config.access || {}) };
    this.refreshConfig = { ...defaultConfig.refresh, ...(config && config.refresh || {}) };
  }

  public setAccessToken(config: RequestInit, body: any, accessToken?: string): [RequestInit, any] {
    if(this.accessConfig.canStore && accessToken){
      const headers = { 
        ...(config.headers || {}), 
        [this.accessConfig.name]: accessToken
      }
      return [{ ...config, headers }, body]
    }
    return [config, body]
  }

  public setRefreshToken(config: RequestInit, body: any, refreshToken?: string): [RequestInit, any] {
    if(this.refreshConfig.canStore && refreshToken){
      const headers = { 
        ...(config.headers || {}), 
        [this.refreshConfig.name]: refreshToken
      }
      return [{ ...config, headers }, body]
    }
    return [config, body]
  }

  public setTokens(config: RequestInit, body: any, tokens: Tokens): [RequestInit, any] {
    const { accessToken, refreshToken } = tokens;
    const [updatedConfig, updatedBody] = this.setAccessToken(config, body, accessToken);
    return this.setRefreshToken(updatedConfig, updatedBody, refreshToken);
	}
	
	public getAccessToken(response: Response, body?: any): string | undefined {
		return response.headers.get(this.accessConfig.name) || undefined
	}

	public getRefreshToken(response: Response, body?: any): string | undefined {
		return response.headers.get(this.refreshConfig.name) || undefined
	}

	public getTokens(response: Response): Tokens {
		return {
			accessToken: this.getAccessToken(response),
			refreshToken: this.getRefreshToken(response)
		}
	}
}
