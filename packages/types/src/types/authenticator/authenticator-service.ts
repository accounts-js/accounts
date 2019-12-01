import { DatabaseInterface } from '../database-interface';
import { Authenticator } from './authenticator';

export interface AuthenticatorService {
  server: any;
  serviceName: string;
  setStore(store: DatabaseInterface): void;
  associate(userId: string, params: any): Promise<any>;
  authenticate(authenticator: Authenticator, params: any): Promise<boolean>;
  // TODO ability to delete an authenticator
}
