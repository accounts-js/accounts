import { OAuthProvider } from 'accounts';

import * as requestPromise from 'request-promise';

export default class FacebookProvider implements OAuthProvider {

	public name: string = 'facebook';

	public authenticate = async (params) => {
		if (!params.access_token) throw new Error('No access token provided');

		const user = await requestPromise({
			json: true,
			method: 'GET',
			qs: { access_token: params.access_token },
			uri: 'https://graph.facebook.com/v2.9/me',
		});
		// TODO get user email and save it
		return {
			id: user.id,
			name: user.name,
		};
	}
}