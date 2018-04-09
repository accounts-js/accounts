export default (state = { user: null }, action: any) => {
	switch(action.type){

		case '@accounts/SET_USER':
			return { ...state, user: action.payload }

		case '@accounts/CLEAR_USER':
			return { ...state, user: undefined }

		default:
			return state
	}
}