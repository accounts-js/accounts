import { 
  Tokens, 
  TokenTransport
} from 'accounts';

import { merge } from 'lodash';

import { Configuration } from "./types/Configuration";
import { TokenConfiguration } from "./types/TokenConfiguration";


const defaultConfig = {
  access: {
    canStore: () => true,
    name: 'accessToken',
  },
  refresh: {
    canStore: () => true,
    name: 'refreshToken',
  }
}


export default class TokenTransportExpressHeaders implements TokenTransport {

  public accessConfig: TokenConfiguration;
  public refreshConfig: TokenConfiguration;

  constructor( config?: Configuration ) {
    
    const access = config && config.access || {}
    const refresh = config && config.refresh || {}

    this.accessConfig = merge({},defaultConfig.access, access)
    this.refreshConfig = merge({},defaultConfig.refresh, refresh)

  }

  public setAccessToken = ( accessToken: string, { req, res } : any ) : void => {

    const canStore: boolean = this.accessConfig.canStore(req);

    if(!canStore) return;

    res.set(this.accessConfig.name, accessToken)

  }

  public setRefreshToken = ( refreshToken: string, { req, res } : any ) : void => {

    const canStore: boolean = this.refreshConfig.canStore(req);

    if(!canStore) return;

    res.set(this.refreshConfig.name, refreshToken)

  }

  public setTokens = ({ accessToken, refreshToken } : Tokens, tokenContainer: any ) : void => {

    this.setAccessToken(accessToken, tokenContainer);

    this.setRefreshToken(refreshToken, tokenContainer);

  }

  public getAccessToken = ( req: any ) : string | undefined => req.get(this.accessConfig.name)

  public getRefreshToken = ( req: any ) : string | undefined => req.get(this.refreshConfig.name)

  public getTokens = ( req: any ): Tokens => ({
    accessToken: this.getAccessToken(req),
    refreshToken: this.getRefreshToken(req)
  })

}
