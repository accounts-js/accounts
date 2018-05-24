import { DatabaseInterface, DatabaseInterfaceSessions } from '@accounts/types';

export interface Configuration {
  userStorage: DatabaseInterface;
  sessionStorage: DatabaseInterface | DatabaseInterfaceSessions;
}
