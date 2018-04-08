export default class ClientRestTTManager {
	
	private tokenTransports: any;

	constructor(...tokenTransports) {
    this.tokenTransports = tokenTransports;
  }

  public setAccessToken(config, accessToken){
    return this.tokenTransports.reduce(
      (acc, tokenTransport) => tokenTransport.setAccessToken(acc)
      ,config
    )
  }

  public setRefreshToken(config, refreshToken){
    return this.tokenTransports.reduce(
      (acc, tokenTransport) => tokenTransport.setRefreshToken(acc)
      ,config
    )
  }

  public setTokens(config, tokens){
    return this.tokenTransports.reduce(
      (acc, tokenTransport) => tokenTransport.setTokens(acc)
      ,config
    )
	}
	
	public getAccessToken(response){
		return this.tokenTransports.reduce(
      async (acc, tokenTransport) => {
        const accessToken = await tokenTransport.getAccessToken(response)
        if(!accessToken){
          return acc
        }
        return accessToken
      }
      ,undefined
    )
  }
  
  public getRefreshToken(response){
		return this.tokenTransports.reduce(
      async (acc, tokenTransport) => {
        const refreshToken = await tokenTransport.getRefreshToken(response)
        if(!refreshToken){
          return acc
        }
        return refreshToken
      }
      ,undefined
    )
	}

	public async getTokens(response){
		return {
			accessToken: await this.getAccessToken(response),
			refreshToken: await this.getRefreshToken(response)
		}
	}
}
