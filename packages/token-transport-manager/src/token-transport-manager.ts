import { Tokens, TokenTransport } from '@accounts/types';
import AccountsError from '@accounts/error';

export default class TokenTransportManager implements TokenTransport {
  private tokenTransports: TokenTransport[];

  constructor(...tokenTransports: TokenTransport[]) {
    this.validateConfiguration(tokenTransports);
    this.tokenTransports = tokenTransports
  }

  public setAccessToken(accessToken: string, transportContainer: object): void {
    this.tokenTransports.forEach(
      (tokenTransport: TokenTransport) => {
        tokenTransport.setAccessToken(accessToken, transportContainer);
      }
    )
  }

  public setRefreshToken(refreshToken: string, transportContainer: object): void {
    this.tokenTransports.forEach(
      (tokenTransport: TokenTransport) => {
        tokenTransport.setRefreshToken(refreshToken, transportContainer);
      }
    )
  }

  public setTokens({ accessToken, refreshToken }: Tokens, transportContainer: object): void {
    this.setAccessToken(accessToken, transportContainer);
    this.setRefreshToken(refreshToken, transportContainer);
  }

  public getAccessToken(transportContainer: object): string | undefined {
    // Execute through all tokenTransports
    return this.tokenTransports.reduce(
      (acc: string | undefined, tokenTransport: TokenTransport) => {
        // Get the potential accessToken from the transport
        const token: string | undefined = tokenTransport.getAccessToken(transportContainer);
        // If it's really a token ? update the accumulator : else return the current accumulator
        return typeof token === "string" && token.length > 0 
          ? token 
          : acc
      },
      undefined
    )
  }

  public getRefreshToken(transportContainer: object): string | undefined {
    // Execute through all tokenTransports
    return this.tokenTransports.reduce(
      (acc: string | undefined, tokenTransport: TokenTransport) => {
        // Get the potential refreshToken from the transport
        const token: string | undefined = tokenTransport.getRefreshToken(transportContainer);
        // If it's really a token ? update the accumulator : else return the current accumulator
        return typeof token === "string" && token.length > 0 
          ? token 
          : acc
      },
      undefined
    )
  }

  public getTokens(transportContainer: object): Tokens {
    return {
      accessToken: this.getAccessToken(transportContainer),
      refreshToken: this.getRefreshToken(transportContainer),
    };
  }

  public removeAccessToken(transportContainer: object): void {
    this.tokenTransports.forEach(
      (tokenTransport: TokenTransport) => {
        tokenTransport.removeAccessToken(transportContainer);
      }
    )
  }

  public removeRefreshToken(transportContainer: object): void {
    this.tokenTransports.forEach(
      (tokenTransport: TokenTransport) => {
        tokenTransport.removeRefreshToken(transportContainer);
      }
    )
  }

  public removeTokens(transportContainer: object): void {
    this.removeAccessToken(transportContainer);
    this.removeRefreshToken(transportContainer);
  }

  private validateConfiguration(config: TokenTransport[]): void {
    if(config.length === 0){
      throw new AccountsError('TokenTransportManager', 'configuration', 'The TokenTransportManager should take at least one parameter TokenTransport')
    }
  }
}