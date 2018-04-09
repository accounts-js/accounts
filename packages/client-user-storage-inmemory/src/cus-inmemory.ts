import { Configuration } from './types/configuration';

export default class CUSInMemory {
	
	public user: any;

	constructor(config?: Configuration){
		this.user = config && config.initialUser || {}
	}

	public setUser(user: any): void {
		this.user = user;
	}

	public clearUser(): void {
		this.user = undefined;
	}

}
