export default class CTSLocalStorage {
	public setAccessToken = accessToken => 
		window.localStorage.setItem('accessToken', accessToken);
		

	public setRefreshToken = refreshToken =>
		window.localStorage.setItem('refreshToken', refreshToken);

	public setTokens = ({ accessToken, refreshToken }) => {
		this.setAccessToken(accessToken);
		this.setRefreshToken(refreshToken);
	};

	public getAccessToken = () => window.localStorage.getItem('accessToken');

	public getRefreshToken = () => window.localStorage.getItem('refreshToken');

	public getTokens = () => ({
		accessToken: this.getAccessToken(),
		refreshToken: this.getRefreshToken()
	});
}
