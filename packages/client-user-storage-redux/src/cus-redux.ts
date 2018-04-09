import { Configuration } from './types/configuration';

import { setUser, clearUser } from './utils/actions';

export default class CUSRedux {

	private store: any;

	constructor(config: Configuration){
		this.store = config.store;
		if(config.initialUser) {
			this.setUser(config.initialUser)
		}
	}

	public setUser(user: any): void {
		this.store.dispatch(setUser(user))
	};

	public clearUser(): void {
		this.store.dispatch(clearUser)
	}

}