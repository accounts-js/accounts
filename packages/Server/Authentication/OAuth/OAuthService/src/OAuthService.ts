import { 
	AuthenticationService, 
	ConnectionInformations,
	DatabaseInterface, 
	LoginResult, 
	OAuthProvider,
	OAuthProviders, 
	User
} from 'accounts';

import AccountsServer from '@accounts/server';

import { Configuration } from "./types/Configuration";

import { forEach } from 'lodash';

export default class OAuthService implements AuthenticationService {
	
	public name: string = 'oauth';

	private accountsServer: AccountsServer;

	private databaseInterface: DatabaseInterface;

	private authenticationProviders: OAuthProviders;

	constructor(config: Configuration) {

		this.authenticationProviders = config.authenticationProviders.reduce(
			( a: OAuthProviders, authenticationProvider: OAuthProvider ) =>
			a[authenticationProvider.name] = authenticationProvider
		,{})

	}

	public link = ( accountsServer: AccountsServer ) : this => {

		this.accountsServer = accountsServer;

		this.databaseInterface = accountsServer.databaseInterface;

		return this;

	}

	public useService = (target, params, connectionInfo: ConnectionInformations ) : any => {

		const providerName: string = target.provider;
		
		const provider: OAuthProvider = this.authenticationProviders[providerName];
		
		if(!provider) throw new Error(`[ Accounts - OAuth ] useService : No provider matches ${providerName} `)
		
		const actionName: string = target.action;

		const OAuthAction: Function = this[actionName];

		if(OAuthAction) return OAuthAction(provider, params, connectionInfo);

		const providerAction: Function = provider[actionName];

		if(!providerAction) throw new Error(`[ Accounts - OAuth ] useService : No action matches ${actionName} `)

		return providerAction( params, connectionInfo )
	}

	public authenticate = async ( provider: OAuthProvider , params, connectionInfo: ConnectionInformations ) : Promise <LoginResult> => {

		const oauthUser: any = await provider.authenticate(params)

		let user: User = await this.databaseInterface.findUserByServiceId( provider.name, oauthUser.id )

		if (!user && oauthUser.email) user = await this.databaseInterface.findUserByEmail(oauthUser.email)

		if (!user) {
			
			const userId: string = await this.databaseInterface.createUser({ email: oauthUser.email })

			user = await this.databaseInterface.findUserById(userId)
		}

		await this.databaseInterface.setService(user.id, provider.name, oauthUser)

		const loginResult: LoginResult = await this.accountsServer.loginWithUser(user, connectionInfo);
		
		return loginResult

	}
}
