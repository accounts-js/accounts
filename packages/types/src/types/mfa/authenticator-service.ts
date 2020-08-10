import { DatabaseInterface } from '../database-interface';
import { Authenticator } from './authenticator';
import { MfaChallenge } from './mfa-challenge';
import { ConnectionInformations } from '../connection-informations';

export interface AuthenticatorService {
  server: any;
  authenticatorName: string;
  setStore(store: DatabaseInterface): void;
  associate(
    userIdOrMfaChallenge: string | MfaChallenge,
    params: any,
    infos: ConnectionInformations
  ): Promise<any>;
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
