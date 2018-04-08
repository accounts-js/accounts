import { Configuration } from './types/configuration';


export default class ClientRestTTBody {
	
	private accessToken: any;
	private refreshToken: any;

	constructor(config: Configuration) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
  }

  public setAccessToken(config, accessToken){
    if(this.accessToken.canStore && accessToken){
      const body = { 
        ...(config.body || {}), 
        [this.accessToken.name]: accessToken
      }
      return { ...config, body }
    }
    return config
  }

  public setRefreshToken(config, refreshToken){
    if(this.refreshToken.canStore && refreshToken){
      const body = { 
        ...(config.body || {}), 
        [this.refreshToken.name]: refreshToken
      }
      return { ...config, body }
    }
    return config
  }

  public setTokens(config, tokens){
    const { accessToken, refreshToken } = tokens;
    const withAccessToken = this.setAccessToken(config, accessToken);
    const withTokens = this.setRefreshToken(config, refreshToken);
    return withTokens
	}
	
	public async getAccessToken(response, body){
    if(body){
      return body[this.accessToken.name]
    }
		const json = await response.json;
		return json[this.accessToken.name]
	}

	public async getRefreshToken(response, body){
    if(body){
      return body[this.accessToken.name]
    }
    const json = await response.json;
		return json[this.refreshToken.name]
	}

	public async getTokens(response){
    const body = await response.json;
		return {
			accessToken: await this.getAccessToken(null, body),
			refreshToken: this.getRefreshToken(null, body)
		}
	}
}
