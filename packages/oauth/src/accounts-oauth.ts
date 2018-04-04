import { User, DatabaseInterface, AuthenticationService, LoginResult, OAuthProviders, OAuthProvider, ConnectionInformations } from '@accounts/types';
import { AccountsServer } from '@accounts/server';
import * as requestPromise from 'request-promise';

import { Configuration } from './types/configuration';

export class AccountsOauth implements AuthenticationService {
  public server: AccountsServer;
  public serviceName = 'oauth';
  private db: DatabaseInterface;
  private providers: OAuthProviders;
  private firewall: string[] = [
    'authenticate',
    'unlink'
  ]

  constructor(config: Configuration) {
    this.validateConfiguration(config);
    this.providers = config.providers.reduce(
      (acc: OAuthProviders, provider: OAuthProvider) => 
      ({ ...acc, [provider.name]: provider})
      ,{}
    )
  }

  public link = (accountsServer: AccountsServer): ThisType<AuthenticationService> => {
    this.server = accountsServer;
    this.db = accountsServer.db;
    return this;
  }

  public setStore(store: DatabaseInterface) {
    this.db = store;
  }

  public useService(target, params, connectionInfo) : any {

		const providerName: string = target.provider;
		// TODO: FIREWALL and PROVIDER INTERFACE
		const provider: any = this.providers[providerName];
		
		if(!provider) {
      throw new Error(`[ Accounts - OAuth ] useService : No provider matches ${providerName} `)
    }
		
		const actionName: string = target.action;

    const actionNameSafe: string = this.firewall.find( actionSafe => actionSafe === actionName)

    if(actionNameSafe) {
      return this[actionNameSafe](params, connectionInfo, provider);
    }

		return provider.useService(actionName, params, connectionInfo)
	}

  public async authenticate(params: any, connectionInfo, provider): Promise<User | null> {
    
    const oauthUser = await provider.authenticate(params);

    let user = await this.db.findUserByServiceId(provider.name, oauthUser.id);

    if (!user && oauthUser.email) {
      user = await this.db.findUserByEmail(oauthUser.email);
    }

    if (!user) {
      const userId = await this.db.createUser({
        email: oauthUser.email,
        profile: oauthUser.profile,
      });

      user = await this.db.findUserById(userId);
    } else {
      // If user exist, attempt to update profile
      this.db.setProfile(user.id, oauthUser.profile);
    }
    await this.db.setService(user.id, provider.name, oauthUser);
    return user;
  }

  public async callback(params, connectionInfo: ConnectionInformations, provider): Promise<LoginResult> {
    const user = await this.authenticate(provider, params, connectionInfo)
    return this.server.loginWithUser(user, connectionInfo)
  }

  public async unlink(provider, params) {
    const { userId } = params;
    await this.db.setService(userId, provider.name, null);
  }

  private validateConfiguration(config: Configuration): void {
    if(!config){
      throw new Error('A configuration object is required')
    }
    if(!config.providers){
      throw new Error('At least one OAuthProvider is required')
    }
    if(!(config.providers instanceof Array)){
      throw new Error('The providers property on the configuration object should be an Array of OAuthProviders')
    }
  }
}
