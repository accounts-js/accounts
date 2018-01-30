// import { Configuration } from './types/Configuration';

export default class TransportRest {
	public apiUrl;

	public client;

	constructor(config: any = {}) {
		this.apiUrl = config.url || '/accounts';
	}

	public link = client => {
		this.client = client;
		return this;
	};

	public handleTokens = (response) => {
		const accessToken = response.headers.get('accessToken');
		const refreshToken = response.headers.get('refreshToken');
		if(accessToken) this.client.tokenStorage.setAccessToken(accessToken);
		if(refreshToken) this.client.tokenStorage.setRefreshToken(refreshToken);

	}

	public fetch = async (target, data, headers) =>  {
		const response = await fetch(`${this.apiUrl}/${target.join('/')}`, {
			body: JSON.stringify(data),
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...headers
			},
			method: 'POST',
			mode: 'same-origin',
			redirect: 'follow'
		});
		this.handleTokens(response);
		return response
		
	}
		
}
