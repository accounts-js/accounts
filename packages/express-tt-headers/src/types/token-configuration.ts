export interface TokenConfiguration {

  name?: string;
  
  canStore?( req: any ): boolean; 
  
}