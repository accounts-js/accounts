import { CookieDirectives } from "./cookie-directives";

export interface TokenConfiguration extends CookieDirectives{

  name?: string;
  
  canStore?( req: any ): boolean; 
  
}