import { JwtData } from './jwt-data';

export interface JwtPayload {
  data: JwtData;
  [key: string]: any;
}
