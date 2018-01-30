export default class CUSInMemory {
	public user;

	constructor(config){
		this.user = config.initialUser
	}

	public setUser = user => this.user = user;

}
