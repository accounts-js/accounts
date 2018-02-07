
import {
	Configuration
} from './types/Configuration';


export default class AccountsClient {
	public transport: any;
	public tokenStorage: any;
	public userStorage: any;
	public strategies: any;
	
	constructor(config) {
		this.tokenStorage = config.tokenStorage;
		this.userStorage = config.userStorage;
		this.transport = config.transport.link(this);
		this.strategies = config.strategies.reduce(
			( strategies, strategy ) => ({ ...strategies, [strategy.name]: strategy.link(this) }),
			{}
		)
	}

	public use = (strategyName) => this.strategies[strategyName];
	
	public refreshTokens = async () => {
		const response = await this.fetch(['refreshTokens'],{})
		return this.handleResponse(response)
	}

	public resumeSession = async () => {
		const accessToken = this.tokenStorage.getAccessToken();
		if(!accessToken) return false;
		const response = await this.fetch(['resumeSession'],{})
		return this.handleResponse(response)
	}

	public fetch = (target, data) => {
		const tokens = this.tokenStorage.getTokens()
		return this.transport.fetch(target, data, tokens)
	}

	public handleResponse = async (response) => {
		const { error, user, accessToken, refreshToken } = await response.json();
		if(error) return error;
		if(user){ 
			this.userStorage.setUser(user);
			console.log(user)
			return user
		}
		return null
	}
}
