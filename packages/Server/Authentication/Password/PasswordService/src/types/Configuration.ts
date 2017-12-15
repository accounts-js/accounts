import { HashAlgorithm } from "./HashAlgorithm";

export interface Configuration {
  
    validation ?: {

      username?: ( username: string ) => boolean | Promise <boolean>;

      email?: ( username: string ) => boolean | Promise <boolean>;

      password?: ( password: string ) => boolean | Promise <boolean>;

    }

    passwordHashAlgorithm?: HashAlgorithm;
  
}