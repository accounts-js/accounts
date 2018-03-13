import { TokenGenerationConfiguration } from "./token-generation-configuration";

export interface Configuration {
	
	secret: string;

	emailTokensExpiration?: number;

	access?: TokenGenerationConfiguration;

	refresh?: TokenGenerationConfiguration

}