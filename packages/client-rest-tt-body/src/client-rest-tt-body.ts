import { Configuration } from './types/configuration';
import { TokenConfiguration } from './types/token-configuration';
import { Tokens } from '@accounts/types';

const defaultConfig: Configuration = {
  access: {
    name: 'accessToken',
    canStore: true,
  },
  refresh: {
    name: 'refreshToken',
    canStore: true
  }
}

export default class ClientRestTTBody {
	
	private accessConfig: TokenConfiguration;
	private refreshConfig: TokenConfiguration;

	constructor(config?: Configuration) {
    this.accessConfig = { ...defaultConfig.access, ...(config && config.access || {}) };
    this.refreshConfig = { ...defaultConfig.refresh, ...(config && config.refresh || {}) };
  }

  public setAccessToken(config: RequestInit, body: any, accessToken?: string): [RequestInit, any] {
    if(this.accessConfig.canStore && accessToken){
      const bodyWithAccessToken = { ...body, [this.accessConfig.name]: accessToken }
      return [config, bodyWithAccessToken]
    }
    return [config, body]
  }

  public setRefreshToken(config: RequestInit, body: any, refreshToken?: string): [RequestInit, any] {
    if(this.refreshConfig.canStore && refreshToken){
      const bodyWithRefreshToken = { ...body, [this.accessConfig.name]: refreshToken }
      return [config, bodyWithRefreshToken]
    }
    return [config, body]
  }

  public setTokens(config: RequestInit, body: any, tokens: Tokens): [RequestInit, any] {
    const { accessToken, refreshToken } = tokens;
    const [updatedConfig, updatedBody] = this.setAccessToken(config, body, accessToken);
    return this.setRefreshToken(updatedConfig, updatedBody, refreshToken);
	}
	
	public async getAccessToken(response: Response, body: any): Promise<string> {
    if(body){
      return body[this.accessConfig.name]
    }
		const json = await response.json();
		return json[this.accessConfig.name]
	}

	public async getRefreshToken(response: Response, body: any): Promise<string> {
    if(body){
      return body[this.refreshConfig.name]
    }
    const json = await response.json();
		return json[this.refreshConfig.name]
	}

	public async getTokens(response: Response): Promise<Tokens> {
    const body = await response.json();
		return {
			accessToken: await this.getAccessToken(response, body),
			refreshToken: await this.getRefreshToken(response, body)
		}
	}
}
