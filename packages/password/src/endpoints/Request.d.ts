declare namespace Express {
  export interface Request {
    userAgent: string;
    ip: string;
    infos: {
      userAgent: string;
      ip: string;
    };
  }
}
