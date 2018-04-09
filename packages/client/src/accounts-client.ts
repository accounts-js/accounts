import { Configuration } from './types/configuration';


export default class AccountsClient {
	public transport: any;
	public tokenStorage: any;
	public userStorage: any;
	public services: any;
	
	constructor(config: Configuration) {
		this.tokenStorage = config.tokenStorage;
		this.userStorage = config.userStorage;
		this.transport = config.transport.link(this);
		this.services = config.services.reduce(
      (services: any, service: any) => 
      ({ ...services, [service.name]: service.link(this) })
      ,{}
		)
	}

	public use(name: string): any {
		return this.services[name];
	}

	public refreshTokens(): Promise<any> {
		return this.fetch(['refreshTokens'],{})
	}
	
	public user(): Promise<any> {
		return this.fetch(['user'],{})
	}

	public impersonate(): Promise<any> {
		return this.fetch(['impersonate'],{})
	}

	public async logout(): Promise<any> {
		const response = await this.fetch(['logout'],{})
		this.tokenStorage.removeTokens();
		return response;
	}

	public async resumeSession(): Promise<any> {
		const accessToken = this.tokenStorage.getAccessToken();
		if(!accessToken) {
      return false;
    }
		const response = await this.fetch(['resumeSession'],{})
		return response
	}

	public async fetch(target: string[], data: any): Promise<any> {
		const response = await this.transport.fetch(target, data);
		return this.handleResponse(response);
	}

	public async handleResponse(response: any): Promise<any> {
		const res = await response.json();
		const { error, user } = res
		if(error) {
      return error;
    }
		if(user) {
      this.userStorage.setUser(user)
    }
		return res
  }
  
}
