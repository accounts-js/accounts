import * as rp from 'request-promise';

export interface AccountsOauthTwitterOptions {
  key: string;
  secret: string;
}

class AccountsOauthTwitter {
  private options: AccountsOauthTwitterOptions;

  constructor(options: AccountsOauthTwitterOptions) {
    this.options = options;
  }

  public async authenticate(params) {
    let data = await rp(`https://api.instagram.com/v1/users/self/?access_token=${params.access_token}`);
    data = JSON.parse(data).data;
    return {
      id: data.id,
      username: data.username,
      profilePicture: data.profile_picture,
      accessToken: params.access_token,
    };
  }
}

export default AccountsOauthTwitter;
