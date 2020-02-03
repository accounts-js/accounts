import { User } from '@accounts/types';
import { JwtPayload } from './jwt-payload';
import { JwtData } from './jwt-data';

export interface JwtPayloadCreator {
  createPayload(data: JwtData, user: User): Promise<JwtPayload>;
}
