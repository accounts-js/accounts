import { 
	Tokens, 
	TokenTransport
} from 'accounts';

export default class TokenTransportManager implements TokenTransport {

	private tokenTransports: TokenTransport[];

	constructor( ...tokenTransports: TokenTransport[] ){

		this.tokenTransports = tokenTransports
	}

	public setAccessToken = ( accessToken: string, transportContainer: object ) : void => 
		this.tokenTransports.forEach( ( tokenTransport: TokenTransport ) => tokenTransport.setAccessToken(accessToken, transportContainer) )

	public setRefreshToken = ( refreshToken: string, transportContainer: object ) : void =>
		this.tokenTransports.forEach( ( tokenTransport: TokenTransport ) => tokenTransport.setRefreshToken(refreshToken, transportContainer) )

	public setTokens = ( { accessToken, refreshToken } : Tokens, transportContainer: object) : void => {
		this.setAccessToken(accessToken, transportContainer);
		this.setRefreshToken(refreshToken, transportContainer);
	}


	public getAccessToken = ( transportContainer: object ) : string | null => this.tokenTransports.reduce(
		( a: string | null, tokenTransport: TokenTransport ) =>
		{
			const temp: any = tokenTransport.getAccessToken(transportContainer);
			return typeof temp === "string" && temp.length > 0 ? temp : a
		}
		, null
	)

	public getRefreshToken = ( transportContainer: object ) : string | null => this.tokenTransports.reduce( 
		( a: string | null, tokenTransport: TokenTransport ) =>
		{
			const temp: any = tokenTransport.getRefreshToken(transportContainer);
			return typeof temp === "string" && temp.length > 0 ? temp : a
		}
		, null
	)

	public getTokens = ( transportContainer: object ) : Tokens => ({
		accessToken: this.getAccessToken(transportContainer),
		refreshToken: this.getRefreshToken(transportContainer)
	})

	public removeAccessToken = ( transportContainer: object ) : void =>
		this.tokenTransports.forEach( ( tokenTransport: TokenTransport ) => tokenTransport.removeAccessToken(transportContainer) )
	
	public removeRefreshToken = ( transportContainer: object ) : void => 
		this.tokenTransports.forEach( ( tokenTransport: TokenTransport ) => tokenTransport.removeRefreshToken(transportContainer) )
	
	public removeTokens = ( transportContainer: object ) : void => {
		this.removeAccessToken(transportContainer);
		this.removeRefreshToken(transportContainer);
	}
}