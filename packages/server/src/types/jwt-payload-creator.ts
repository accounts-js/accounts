import { User } from '@accounts/types';
import { JwtPayload } from './jwt-payload';
import { JwtData } from './jwt-data';

export interface JwtPayloadCreator {
  createPayload(user: User, data: JwtData): Promise<JwtPayload>;
}
