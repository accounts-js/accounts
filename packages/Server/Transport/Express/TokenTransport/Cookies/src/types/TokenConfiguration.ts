import { CookieDirectives } from "./CookieDirectives";

export interface TokenConfiguration extends CookieDirectives {

  name: string;

  canStore( req: any ) : boolean; 
  
}