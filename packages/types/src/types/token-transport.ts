import { Tokens } from "./tokens";

export interface TokenTransport {

	setAccessToken(accessToken: string, transportContainer: object): void;

	setRefreshToken(refreshToken: string, transportContainer: object): void;
	
	setTokens(tokens: Tokens, transportContainer: object): void;
	
	getAccessToken(transportContainer: object): string;
	
	getRefreshToken(transportContainer: object): string;
	
	getTokens(transportContainer: object): Tokens;

	removeAccessToken(transportContainer: object): void;

	removeRefreshToken(transportContainer: object): void;

	removeTokens(transportContainer: object): void;

}