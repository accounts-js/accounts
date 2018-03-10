import * as oauth from 'oauth';

import { AccountsOAuthTwitterOptions } from './types/AccountsOAuthTwitterOptions';


export class AccountsOAuthTwitter {
  private options: AccountsOAuthTwitterOptions;
  private oauth: any;

  constructor(options: AccountsOAuthTwitterOptions) {
    this.options = options;
    this.oauth = new oauth.OAuth(
      'https://twitter.com/oauth/request_token',
      'https://twitter.com/oauth/access_token',
      this.options.key,
      this.options.secret,
      '1.0A',
      null,
      'HMAC-SHA1'
    );
  }

  public authenticate(params) {
    return new Promise((resolve, reject) => {
      this.oauth.get(
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
        }
      );
    });
  }
}
