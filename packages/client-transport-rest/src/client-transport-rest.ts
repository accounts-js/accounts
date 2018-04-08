import { Configuration } from './types/configuration';


export default class ClientTransportRest {

	public url;

	public client;

	private tokenTransport;

	constructor(config: Configuration) {
		this.url = config.url || '/accounts';
		this.tokenTransport = config.tokenTransport
	}

	public link = client => {
		this.client = client;
		return this;
	};

	public fetch = async (target, data) =>  {
		// Get tokens from client
		const tokens = this.client.tokenStorage.getTokens();
		// Get default request config
		const fetchConfig = this.getDefaultFetchConfig()
		// Add tokens to the request
		const config = this.tokenTransport.setTokens(fetchConfig, tokens);
		// Add the data to the request and includes the potentials body tokens
		config.body = JSON.stringify({ ...config.body, ...data })
		// Fetch the server
		const response = await fetch(`${this.url}/${target.join('/')}`, config);
		// Get the tokens from the response
		const responseTokens = this.tokenTransport.getTokens(response.clone());
		// Get the JSON from response
		const body = await response.json();
		return { data: body, tokens: responseTokens }
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
