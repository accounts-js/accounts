import { TokenGenerationConfiguration } from "./TokenGenerationConfiguration";

export interface Configuration {
	
	secret: string;

	emailTokensExpiration?: number;

	access?: TokenGenerationConfiguration;

	refresh?: TokenGenerationConfiguration

}