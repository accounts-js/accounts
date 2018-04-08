import { Configuration } from './types/configuration';


export default class ClientRestTTHeaders {
	
	private accessToken: any;
	private refreshToken: any;

	constructor(config: Configuration) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
  }

  public setAccessToken(config, accessToken){
    if(this.accessToken.canStore && accessToken){
      const headers = { 
        ...(config.headers || {}), 
        [this.accessToken.name]: accessToken
      }
      return { ...config, headers }
    }
    return config
  }

  public setRefreshToken(config, refreshToken){
    if(this.refreshToken.canStore && refreshToken){
      const headers = { 
        ...(config.headers || {}), 
        [this.refreshToken.name]: refreshToken
      }
      return { ...config, headers }
    }
    return config
  }

  public setTokens(config, tokens){
    const { accessToken, refreshToken } = tokens;
    const withAccessToken = this.setAccessToken(config, accessToken);
    const withTokens = this.setRefreshToken(config, refreshToken);
    return withTokens
	}
	
	public getAccessToken(response){
		const accessToken = response.get(this.accessToken.name)
		return accessToken
	}

	public getRefreshToken(response){
		const refreshToken = response.get(this.refreshToken.name)
		return refreshToken
	}

	public getTokens(response){
		return {
			accessToken: this.getAccessToken(response),
			refreshToken: this.getRefreshToken(response)
		}
	}
}
