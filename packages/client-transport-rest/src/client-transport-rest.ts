import { Configuration } from './types/configuration';

export default class ClientTransportRest {

	public url: string;

	public client: any;

	private tokenTransport: any;

	constructor(config: Configuration) {
		this.url = config.url || '/accounts';
		this.tokenTransport = config.tokenTransport
	}

	public link = (client: any) => {
		this.client = client;
		return this;
	};

	public fetch = async (target: string[], data: any): Promise<any> => {
		// Get tokens from client
		const tokens = this.client.tokenStorage.getTokens();
		// Get default request config
		const fetchConfig = this.getDefaultFetchConfig()
		// Add tokens to the request
		const [config, body] = this.tokenTransport.setTokens(fetchConfig, {}, tokens);
		// Add the data to the request and includes the potentials body tokens
		config.body = JSON.stringify({ ...body, ...data })
		// Fetch the server
		const response = await fetch(`${this.url}/${target.join('/')}`, config);
		// Get the tokens from the response
		const responseTokens = this.tokenTransport.getTokens(response.clone());
		// Store the tokens
		this.client.tokenStorage.setTokens(responseTokens);
		// Get the JSON from response
		return response.json();
	}

	private getDefaultFetchConfig(){
		return {
			method: 'POST',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			mode: 'same-origin',
			redirect: 'follow'
		}
	}

}
