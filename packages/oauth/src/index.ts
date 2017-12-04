import { UserObjectType } from '@accounts/common';
import { AccountsServer, DBInterface, AuthService } from '@accounts/server';
import * as requestPromise from 'request-promise';

class AccountsOauth implements AuthService {
  public db: DBInterface;
  public server: AccountsServer;
  public serviceName = 'oauth';
  private options: any;

  constructor(options) {
    this.options = options;
  }

  public async authenticate(params: any): Promise<UserObjectType | null> {
    if (!params.provider || !this.options[params.provider]) {
      throw new Error('Invalid provider');
    }

    const userProvider = this.options[params.provider];

    if (!userProvider) {
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

  public async unlink(userId, params) {
    if (!params.provider || !this.options[params.provider]) {
      throw new Error('Invalid provider');
    }

    const userProvider = this.options[params.provider];

    if (!userProvider) {
      throw new Error('Invalid provider');
    }

    await this.db.setService(userId, params.provider, null);
  }

}

export default AccountsOauth;
export { AccountsOauth };
