import { setCookie } from './utils/set-cookie';
import { getCookie } from './utils/get-cookie';

import { Configuration } from './types/configuration';


export default class ClientRestTTCookies {
	
	private accessConfig: any;
	private refreshConfig: any;

	constructor(config: Configuration) {
    this.accessConfig = config.access;
    this.refreshConfig = config.refresh;
  }

  public setAccessToken(config, accessToken){
    if(this.accessConfig.canStore && accessToken){
      setCookie(this.accessConfig.name, accessToken, this.accessConfig.maxAge || 1*60*60*1000)
    }
    return config
  }

  public setRefreshToken(config, refreshToken){
    if(this.refreshConfig.canStore && refreshToken){
      setCookie(this.refreshConfig.name, refreshToken, this.refreshConfig.maxAge || 1*60*60*1000)
    }
    return config
  }

  public setTokens(config, tokens){
    const { accessToken, refreshToken } = tokens;
    const withAccessToken = this.setAccessToken(config, accessToken);
    const withTokens = this.setRefreshToken(config, refreshToken);
    return withTokens
	}
	
	public async getAccessToken(){
		return getCookie(this.accessConfig.name) || undefined
	}

	public async getRefreshToken(){
    return getCookie(this.refreshConfig.name) || undefined
	}

	public async getTokens(response){
    const body = await response.json;
		return {
			accessToken: await this.getAccessToken(),
			refreshToken: this.getRefreshToken()
		}
  }
}
