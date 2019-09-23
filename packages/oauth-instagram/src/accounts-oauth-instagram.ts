import rp from 'request-promise';

export class AccountsOAuthInstagram {
  public async authenticate(params: any) {
    let data = await rp(
      `https://api.instagram.com/v1/users/self/?access_token=${params.access_token}`
    );
    data = JSON.parse(data).data;
    return {
      id: data.id,
      username: data.username,
      profilePicture: data.profile_picture,
      accessToken: params.access_token,
    };
  }
}
