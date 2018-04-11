import { TokenConfiguration } from './token-configuration'

export interface Configuration<T> {

	access: T;

	refresh: T;
	
}