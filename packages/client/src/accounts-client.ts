import { Configuration } from './types/configuration';


export default class AccountsClient {
	public transport: any;
	public tokenStorage: any;
	public userStorage: any;
	public strategies: any;
	
	constructor(config: Configuration) {
		this.tokenStorage = config.tokenStorage;
		this.userStorage = config.userStorage;
		this.transport = config.transport.link(this);
		this.strategies = config.strategies.reduce(
      (strategies, strategy) => 
      ({ ...strategies, [strategy.name]: strategy.link(this) })
      ,{}
		)
	}

	public use = (strategyName) => this.strategies[strategyName];

	public refreshTokens = async () => {
		const response = await this.fetch(['refreshTokens'],{})
		return this.handleResponse(response)
	}
	
	public user = async () => {
		const response = await this.fetch(['user'],{})
		return this.handleResponse(response)
	}

	public impersonate = async () => {
		const response = await this.fetch(['impersonate'],{})
		return this.handleResponse(response)
	}

	public logout = async () => {
		const response = await this.fetch(['logout'],{})
		this.tokenStorage.setTokens({accessToken:null, refreshToken:null})
		return this.handleResponse(response)
	}

	public resumeSession = async () => {
		const accessToken = this.tokenStorage.getAccessToken();
		if(!accessToken) {
      return false;
    }
		const response = await this.fetch(['resumeSession'],{})
		return this.handleResponse(response)
	}

	public fetch = (target, data) => {
		const tokens = this.tokenStorage.getTokens()
		return this.transport.fetch(target, data, tokens)
	}

	public handleResponse = async (response) => {
		const res = await response.json();
		const { error, user, accessToken, refreshToken } = res
		if(error) {
      return error;
    }
		if(user) {
      this.userStorage.setUser(user)
    }
		return res
  }
  
}
