import {
  DatabaseInterface,
  DatabaseInterfaceSessions,
  DatabaseInterfaceMfaLoginAttempts,
} from '@accounts/types';

export interface Configuration {
  userStorage: DatabaseInterface;
  sessionStorage: DatabaseInterface | DatabaseInterfaceSessions;
  mfaLoginAttemptsStorage?: DatabaseInterface | DatabaseInterfaceMfaLoginAttempts;
}
