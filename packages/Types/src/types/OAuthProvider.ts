export interface OAuthProvider {

  name: string;

  authenticate( params ) : any

}

export interface OAuthProviders {

  [ providerName: string ] : OAuthProvider;

}