import { DatabaseInterface } from '../database-interface';
import { Authenticator } from './authenticator';
import { MfaChallenge } from '../mfa-challenge/mfa-challenge';
import { ConnectionInformations } from '../connection-informations';

export interface AuthenticatorService {
  server: any;
  serviceName: string;
  setStore(store: DatabaseInterface): void;
  associate(userId: string, params: any, infos: ConnectionInformations): Promise<any>;
  challenge?(
    mfaChallenge: MfaChallenge,
    authenticator: Authenticator,
    infos: ConnectionInformations
  ): Promise<any>;
  authenticate(
    mfaChallenge: MfaChallenge,
    authenticator: Authenticator,
    params: any,
    infos: ConnectionInformations
  ): Promise<boolean>;
  sanitize?(authenticator: Authenticator): Authenticator;
  // TODO ability to delete an authenticator
}
