import AccountsServer from "@accounts/server";

import { TokenTransport } from 'accounts';


export interface Configuration {
  
  tokenTransport: TokenTransport;

  accountsServer?: AccountsServer;

  path?: string;

}