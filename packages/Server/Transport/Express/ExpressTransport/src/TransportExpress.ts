import AccountsServer from '@accounts/server';

import { 
	ConnectionInformations, 
	ImpersonationResult, 
	LoginResult, 
	Tokens, 
	TokenTransport, 
	UserSafe  
} from 'accounts';

import { Configuration } from './types/Configuration';

import { Router } from 'express';

import { getConnectionInfo } from './utils/getConnectionInfos';

export default class TransportExpress {

	private accountsServer: AccountsServer;

	private tokenTransport: TokenTransport;

	public router: any;
	
	private path: string;
	

	constructor( config: Configuration ){

		this.accountsServer = config.accountsServer;

		this.tokenTransport = config.tokenTransport;

		this.path = config.path || 'accounts';

		this.router = Router({ mergeParams: true })
			.post(`/${this.path}/impersonate`, this.impersonate)
			.post(`/${this.path}/user`, this.user)
			.post(`/${this.path}/refreshTokens`, this.refreshTokens)
			.post(`/${this.path}/logout`, this.logout)
			.post(`/${this.path}/:service/:provider?/:action`, this.useService)

	}

	public link = ( accountsServer: AccountsServer ) : this => {
		
		this.accountsServer = accountsServer;
				
		return this;
		
	}

	// middlewar  e
	public middleware = async ( req: any, res: any, next: Function ) : Promise <void> => {

		// Retrieve access token
		const accessToken: string | null = this.tokenTransport.getAccessToken(req);
		
		if(!accessToken) return next() // If no accessToken from client => do nothing
		try {
			// If there is an accessToken provided by client => try to resume session
			const user: UserSafe = await this.accountsServer.resumeSession(accessToken);

			// Assign result of session resuming to request object 
			req.user = user;
			req.userId = user.id;
		} finally {
			next();
		}
		
	}

	private send = ( res: any, data: any = {} ) : void => {

		const toSend: any = res.toSend || {};

		res.json({ ...data, ...toSend })
	}



	private impersonate = async ( req: any, res: any ) : Promise <void> => {

			const username: string = req.body.username;

			const accessToken: string | null = this.tokenTransport.getAccessToken(req);

			const connectionInfo: ConnectionInformations = getConnectionInfo(req);

			const { authorized, tokens, user } : ImpersonationResult = await this.accountsServer.impersonate(accessToken, username, connectionInfo);

			this.tokenTransport.setTokens(tokens, { req, res });

			this.send(res, { authorized, user })

	}

	private user = async ( req: any, res: any ) : Promise <void> => {

			const accessToken: string | null = this.tokenTransport.getAccessToken(req);

			const user : UserSafe = await this.accountsServer.resumeSession(accessToken);

			this.send(res, user)
	}

	private refreshTokens = async ( req: any, res: any ) : Promise <void> => {

			const requestTokens: Tokens = this.tokenTransport.getTokens(req);

			const connectionInfo: ConnectionInformations = getConnectionInfo(req);

			const { tokens, user, sessionId } : LoginResult = await this.accountsServer.refreshTokens(requestTokens, connectionInfo);

			this.tokenTransport.setTokens(tokens, { req, res });

			this.send(res, { user, sessionId });
	}

	private logout = async ( req: any, res: any ) : Promise <void> => {

			const accessToken: string | null = this.tokenTransport.getAccessToken(req);
			
			await this.accountsServer.logout(accessToken);

			this.tokenTransport.removeTokens(res);

			this.send(res, { message: 'Logged out' })

	}

	private useService = async ( req: any, res: any ) : Promise <void> => {
		// Identify the service
		const target: any = req.params;

		// Extract the action parameters
		const params: any = req.body;

		// Extract the connection informations from the request
		const connectionInfo: ConnectionInformations = getConnectionInfo(req)

		try {
			const { tokens, ...response } : any = await this.accountsServer.useService(target, params, connectionInfo)
			if(tokens) this.tokenTransport.setTokens(tokens, { req, res });
			this.send(res, response);
		} catch (err) {
			this.send(res, {error: err.message});
		}
	}

}