import { RefreshTokenPayload, TokenManagerInterface, TokenPayload, TokenRecord } from 'accounts';

import { Configuration } from './types/Configuration';
import { TokenGenerationConfiguration } from './types/TokenGenerationConfiguration';

import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';



const defaultTokenConfig: TokenGenerationConfiguration = {
		algorithm:'HS256',
		/*expiresIn:undefined,
    notBefore:undefined,
    audience:undefined,
    /*jwtid:null,
    subject:null,
    noTimestamp:null,
    header:null,
    keyid:null,*/
}

const defaultAccessTokenConfig: TokenGenerationConfiguration = {
		expiresIn:'90m',
}

const defaultRefreshTokenConfig: TokenGenerationConfiguration = {
		expiresIn: '7d',
}

export default class TokenManager implements TokenManagerInterface {

		private secret: string;
		private emailTokensExpiration: number;
		private accessTokenConfig: TokenGenerationConfiguration;
		private refreshTokenConfig: TokenGenerationConfiguration;

		constructor( config: Configuration ){
				this.secret = config.secret;
				this.emailTokensExpiration = config.emailTokensExpiration || (1000*60);
				this.accessTokenConfig = { ...defaultTokenConfig, ...defaultAccessTokenConfig, ...config.access };
				this.refreshTokenConfig = { ...defaultTokenConfig, ...defaultRefreshTokenConfig, ...config.refresh };
		}

		public generateRandom = ( length: number | undefined = 43 ) => randomBytes(length).toString('hex');

		public generateAccess = ( data: TokenPayload ) => jwt.sign({ data }, this.secret, this.accessTokenConfig);

		public generateRefresh = ( data: TokenPayload = {} ) => jwt.sign({ data }, this.secret, this.refreshTokenConfig);

		public isTokenExpired = ( token: string, tokenRecord?: TokenRecord ): boolean => 
				!tokenRecord || Number(tokenRecord.when) + this.emailTokensExpiration < Date.now()

				

		public decode = async ( token: string, ignoreExpiration: boolean = false ) : Promise <TokenPayload> =>
				jwt.verify(token, this.secret, { ignoreExpiration } )
		// .catch( ( err: Error ) => { throw new Error(' [ Accounts - TokenManager ] Token is invalid ') } )
}