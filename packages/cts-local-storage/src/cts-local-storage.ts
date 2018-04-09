import { Tokens } from "@accounts/types";

export default class CTSLocalStorage {

	public setAccessToken = (accessToken: string): void => {
		if(this.checkToken(accessToken)){
			localStorage.setItem('accessToken', accessToken);
		}
	}

	public setRefreshToken = (refreshToken: string): void => {
		if(this.checkToken(refreshToken)){
			localStorage.setItem('refreshToken', refreshToken);
		}
	}

	public setTokens = ({ accessToken, refreshToken }: Tokens): void => {
		this.setAccessToken(accessToken);
		this.setRefreshToken(refreshToken);
	};

	public getAccessToken = (): string | undefined => {
		const accessToken = localStorage.getItem('accessToken');
		if(this.checkToken(accessToken)){ 
			return accessToken
		}
		return undefined
	}

	public getRefreshToken = (): string | undefined => {
		const refreshToken = localStorage.getItem('refreshToken');
		if(this.checkToken(refreshToken)){ 
			return refreshToken
		}
		return undefined
	}

	public getTokens = (): Tokens => ({
		accessToken: this.getAccessToken(),
		refreshToken: this.getRefreshToken()
	});

	private checkToken = (token: string): boolean => {
		if(typeof token !== "string"){
			return false
		}
		if(token.length < 5){
			return false
		}
		return true
	}
}