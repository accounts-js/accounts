import { TokenConfiguration } from "./TokenConfiguration";

export interface Configuration {

  access: TokenConfiguration;

  refresh: TokenConfiguration;
  
}