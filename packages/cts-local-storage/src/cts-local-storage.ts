declare var window: Window;

export default class CTSLocalStorage {

	public setAccessToken = (accessToken: string): void => {
		if(this.checkToken(accessToken)){
			window.localStorage.setItem('accessToken', accessToken);
		}
	}

	public setRefreshToken = (refreshToken: string): void => {
		if(this.checkToken(refreshToken)){
			window.localStorage.setItem('refreshToken', refreshToken);
		}
	}

	public setTokens = ({ accessToken, refreshToken }) => {
		this.setAccessToken(accessToken);
		this.setRefreshToken(refreshToken);
	};

	public getAccessToken = (): string | undefined => {
		const accessToken = window.localStorage.getItem('accessToken');
		if(this.checkToken(accessToken)){ 
			return accessToken
		}
		return undefined
	}

	public getRefreshToken = (): string | undefined => {
		const refreshToken = window.localStorage.getItem('refreshToken');
		if(this.checkToken(refreshToken)){ 
			return refreshToken
		}
		return undefined
	}

	public getTokens = () => ({
		accessToken: this.getAccessToken(),
		refreshToken: this.getRefreshToken()
	});

	private checkToken = (token: string) => {
		if(typeof token !== "string"){
			return false
		}
		if(token.length < 5){
			return false
		}
		return true
	}
}
