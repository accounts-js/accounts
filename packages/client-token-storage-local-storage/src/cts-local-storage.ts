import { Tokens } from "@accounts/types";

export default class CTSLocalStorage {

	public setAccessToken(accessToken?: string): void {
		if(this.checkToken(accessToken)){
			localStorage.setItem('accessToken', accessToken as string);
		}
	}

	public setRefreshToken(refreshToken?: string): void {
		if(this.checkToken(refreshToken)){
			localStorage.setItem('refreshToken', refreshToken as string);
		}
	}

	public setTokens({ accessToken, refreshToken }: Tokens): void {
		this.setAccessToken(accessToken);
		this.setRefreshToken(refreshToken);
	};

	public getAccessToken(): string | undefined {
		const accessToken = localStorage.getItem('accessToken')
		if(this.checkToken(accessToken)){ 
			return accessToken as string
		}
		return undefined
	}

	public getRefreshToken(): string | undefined {
		const refreshToken = localStorage.getItem('refreshToken');
		if(this.checkToken(refreshToken)){ 
			return refreshToken as string
		}
		return undefined
	}

	public getTokens(): Tokens {
		return {
			accessToken: this.getAccessToken(),
			refreshToken: this.getRefreshToken()
		};
	}

	public removeAccessToken(): void {
		localStorage.removeItem('accessToken')
	}

	public removeRefreshToken(): void {
		localStorage.removeItem('refreshToken')
	}

	public removeTokens(): void {
		this.removeAccessToken();
		this.removeRefreshToken();
	}

	private checkToken(token?: string | null): boolean {
		if(!token){
			return false;
		}
		if(typeof token !== "string"){
			return false;
		}
		if(token.length < 5){
			return false;
		}
		return true;
	}
}