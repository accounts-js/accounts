import { Tokens } from '@accounts/types';

export default class ClientRestTTManager {
	
	private tokenTransports: any[];

	constructor(...tokenTransports: any[]) {
    this.tokenTransports = tokenTransports;
  }

  public setAccessToken(config: RequestInit, body: any, accessToken?: string): [RequestInit, any] {
    return this.tokenTransports.reduce(
      ([accConfig, accBody]: [RequestInit, any], tokenTransport: any): [RequestInit, any] =>
      tokenTransport.setAccessToken(accConfig, accBody, accessToken)
      , [config, body]
    )
  }

  public setRefreshToken(config: RequestInit, body: any, refreshToken?: string): [RequestInit, any] {
    return this.tokenTransports.reduce(
      ([accConfig, accBody]: [RequestInit, any], tokenTransport: any): [RequestInit, any] =>
      tokenTransport.setRefreshToken(accConfig, accBody, refreshToken)
      , [config, body]
    )
  }

  public setTokens(config: RequestInit, body: any, tokens: Tokens): [RequestInit, any] {
    return this.tokenTransports.reduce(
      ([accConfig, accBody]: [RequestInit, any], tokenTransport: any): [RequestInit, any] =>
      tokenTransport.setTokens(accConfig, accBody, tokens)
      , [config, body]
    )
	}
	
	public getAccessToken(response: Response): Promise<string>{
		return this.tokenTransports.reduce(
      async (acc: string, tokenTransport: any) => {
        const accessToken: string = await tokenTransport.getAccessToken(response)
        if(!accessToken){
          return acc
        }
        return accessToken
      }
      ,undefined
    )
  }
  
  public getRefreshToken(response: Response){
		return this.tokenTransports.reduce(
      async (acc: string, tokenTransport: any) => {
        const refreshToken: string = await tokenTransport.getRefreshToken(response)
        if(!refreshToken){
          return acc
        }
        return refreshToken
      }
      ,undefined
    )
	}

	public async getTokens(response: Response){
		return {
			accessToken: await this.getAccessToken(response),
			refreshToken: await this.getRefreshToken(response)
		}
	}
}