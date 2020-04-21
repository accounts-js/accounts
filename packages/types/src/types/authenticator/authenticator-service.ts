import { DatabaseInterface } from '../database-interface';
import { Authenticator } from './authenticator';
import { MfaChallenge } from '../mfa-challenge/mfa-challenge';

export interface AuthenticatorService {
  server: any;
  serviceName: string;
  setStore(store: DatabaseInterface): void;
  challenge?(mfaChallenge: MfaChallenge, authenticator: Authenticator): Promise<any>;
  associate(userId: string, params: any): Promise<any>;
  authenticate(authenticator: Authenticator, params: any): Promise<boolean>;
  sanitize?(authenticator: Authenticator): Authenticator;
  // TODO ability to delete an authenticator
}
