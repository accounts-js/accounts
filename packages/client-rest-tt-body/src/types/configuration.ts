import { TokenConfiguration } from './token-configuration'

export interface Configuration {

	access: TokenConfiguration;

	refresh: TokenConfiguration;
	
}