
export interface CookieDirectives {

  secure?: boolean,

  httpOnly?: boolean,

  expires?: Date,

  maxAge?: number,

  domain?: boolean | string,

  path?: string,

  sameSite?: string
  
}