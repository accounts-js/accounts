import { DatabaseInterface } from '../database-interface';

export interface AuthenticatorService {
  server: any;
  serviceName: string;
  setStore(store: DatabaseInterface): void;
  associate(userId: string, params: any): Promise<any>;
  authenticate(authenticatorId: string, params: any): Promise<boolean>;
  // TODO ability to delete an authenticator
}
