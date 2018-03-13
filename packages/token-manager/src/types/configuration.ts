import { TokenGenerationConfiguration } from './token-generation-configuration';

export interface Configuration {
  secret: string;

  emailTokenExpiration?: number;

  access?: TokenGenerationConfiguration;

  refresh?: TokenGenerationConfiguration;
}
