import AccountsServer from "@accounts/server";
import { TokenTransport } from "@accounts/types";


export interface Configuration {

	path?: string;

	tokenTransport: TokenTransport;

}