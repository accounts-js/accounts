const setUser = (user) => ({
	payload: user,
	type: '@accounts/SET_USER'
})

const clearUser = {
	type: '@accounts/CLEAR_USER'
}

export default class CUSRedux {

	private store

	constructor(config){
		this.store = config.store;
		if(config.initialUser) this.setUser(config.initialUser)
	}

	public setUser = user => {
		this.store.dispatch(setUser(user))
	};

	public clearUser = () => {
		this.store.dispatch(clearUser)
	}

}

