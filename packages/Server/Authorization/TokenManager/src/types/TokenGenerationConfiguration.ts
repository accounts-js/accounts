export interface TokenGenerationConfiguration {
	
	algorithm?: string;

	expiresIn?: string;

	notBefore?: string;

	audience?: string | string[] | RegExp | RegExp[];

	/*

  To complete
  
  jwtid:

  subject:null,

  noTimestamp:null,

  header:null,

  keyid:null,*/

}