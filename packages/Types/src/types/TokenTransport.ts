import { Tokens } from "./Tokens";

export interface TokenTransport {

  setAccessToken( accessToken: string, transportContainer: object ) : void;

  getAccessToken( transportContainer: any ) : string;
  
  setRefreshToken( refreshToken: string, transportContainer: object ) : void;

  getRefreshToken( transportContainer: object ) : string;

  setTokens( tokens: Tokens, transportContainer: object ) : void;
  
  getTokens( transportContainer: object ) : Tokens;

}