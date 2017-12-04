import * as oauth from 'oauth';

export interface AccountsOauthTwitterOptions {
  key: string;
  secret: string;
}

class AccountsOauthTwitter {
  private options: AccountsOauthTwitterOptions;

  constructor(options: AccountsOauthTwitterOptions) {
    this.options = options;
  }

  public authenticate(params) {
    const oa = new oauth.OAuth(
      'https://twitter.com/oauth/request_token',
      'https://twitter.com/oauth/access_token',
      this.options.key,
      this.options.secret,
      '1.0A',
      null,
      'HMAC-SHA1',
    );
    return new Promise((resolve, reject) => {
      oa.get(
        'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        params.access_token,
        params.access_token_secret,
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            data = JSON.parse(data);
            const user = {
              id: data.id_str,
              screenName: data.screen_name,
              profilePicture: data.profile_image_url_https,
              email: data.email,
              accessToken: params.access_token,
              accessTokenSecret: params.access_token_secret,
            };
            resolve(user);
          }
        },
      );
    });

  }
}

export default AccountsOauthTwitter;
