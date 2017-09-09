import * as requestPromise from 'request-promise';

export class AccountsOauth {
  private options: any;
  private db: any;
  private accountsServer: any;

  constructor(options) {
    this.options = options;
  }

  public async authenticate(params: any): Promise<any> {
    const { userProvider = this[params.provider] } = this.options[params.provider];
    
    if (!params.provider || !userProvider) {
      throw new Error('Invalid provider');
    }
    
    const oauthUser = await userProvider(params);
    let user = await this.db.findUserByServiceId(params.provider, oauthUser.id);
    if (!user) {
      // TODO check email doesn't exist in db
      const userId = await this.db.createUser({});
      user = await this.db.findUserById(userId);
    }
    await this.db.setService(user.id, params.provider, oauthUser);
    return user;
  }

  private async facebook(params): Promise<any> {
    if (!params.access_token) {
      throw new Error('No access token provided');
    }
    const user = await requestPromise({
      method: 'GET',
      json: true,
      uri: 'https://graph.facebook.com/v2.9/me',
      qs: { access_token: params.access_token },
    });
    // get user email
    return {
      id: user.id,
      name: user.name,
    };
  }
}
