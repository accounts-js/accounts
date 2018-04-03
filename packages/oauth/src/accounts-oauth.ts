import { User, DatabaseInterface, AuthenticationService } from '@accounts/types';
import { AccountsServer } from '@accounts/server';
import * as requestPromise from 'request-promise';

import { OAuthOptions } from './types/oauth-options';

export class AccountsOauth implements AuthenticationService {
  public server: AccountsServer;
  public serviceName = 'oauth';
  private db: DatabaseInterface;
  private options: OAuthOptions;

  constructor(options: OAuthOptions) {
    this.options = options;
  }

  public link = (accountsServer: AccountsServer) => {
    this.server = accountsServer;
    return this;
  }

  public setStore(store: DatabaseInterface) {
    this.db = store;
  }

  public async authenticate(params: any): Promise<User | null> {
    if (!params.provider || !this.options[params.provider]) {
      throw new Error('Invalid provider');
    }

    const userProvider = this.options[params.provider];

    if (typeof userProvider.authenticate !== 'function') {
      throw new Error('Invalid provider');
    }

    const oauthUser = await userProvider.authenticate(params);
    let user = await this.db.findUserByServiceId(params.provider, oauthUser.id);

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
    await this.db.setService(user.id, params.provider, oauthUser);
    return user;
  }

  public async unlink(userId, provider) {
    if (!provider || !this.options[provider]) {
      throw new Error('Invalid provider');
    }

    await this.db.setService(userId, provider, null);
  }
}
