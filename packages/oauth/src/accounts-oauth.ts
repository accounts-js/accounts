import { User, DatabaseInterface, AuthenticationService, LoginResult } from '@accounts/types';
import { AccountsServer } from '@accounts/server';
import * as requestPromise from 'request-promise';

import { OAuthOptions } from './types/oauth-options';

export class AccountsOauth implements AuthenticationService {
  public server: AccountsServer;
  public serviceName = 'oauth';
  private db: DatabaseInterface;
  private options: OAuthOptions;
  private providers: any;
  private firewall: string[] = [
    'authenticate',
    'unlink'
  ]

  constructor(options: OAuthOptions) {
    this.options = options;
    this.providers = options.providers
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
      return this[actionNameSafe](provider, params, connectionInfo);
    }

		return provider.useService(actionName, params, connectionInfo)
	}

  public async authenticate(provider, params: any, connectionInfo): Promise<User | null> {
    
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

  public async callback(provider, params, connectionInfo): Promise<LoginResult> {
    const user = await this.authenticate(provider, params, connectionInfo)
    return this.server.loginWithUser(user, connectionInfo)
  }

  public async unlink(provider, params) {
    const { userId } = params;
    await this.db.setService(userId, provider.name, null);
  }
}
