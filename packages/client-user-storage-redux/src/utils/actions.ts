export const setUser = (user: any) => ({
	payload: user,
	type: '@accounts/SET_USER'
})

export const clearUser = {
	type: '@accounts/CLEAR_USER'
}