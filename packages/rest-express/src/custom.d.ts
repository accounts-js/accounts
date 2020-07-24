declare namespace Express {
  export interface Request {
    userAgent: string;
    ip: string;
  }
}
