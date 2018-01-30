
import {
	Configuration
} from './types/Configuration';


export default class Password {

	public name = 'password'
	public client;

	public link = (client) => {
		this.client = client;
		return this
	}

	public login = async ({ username, email, password }) => {
		const response = await this.client.fetch(['password','authenticate'], {
			email,
			password,
			username
		});
		return this.client.handleResponse(response)
	};

	public register = async ({ username, email, password }) => {
		const response = await this.client.fetch(['password','register'], {
			email,
			password,
			username
		});
		this.client.tokenStorage.setAccessToken(response.headers.get('accessToken'));
		this.client.tokenStorage.setRefreshToken(response.headers.get('refreshToken'));
	};

}
