import {
  DatabaseInterface,
  DatabaseInterfaceSessions,
  DatabaseInterfaceServicePassword,
} from '@accounts/types';

export interface Configuration {
  userStorage: DatabaseInterface;
  sessionStorage?: DatabaseInterfaceSessions;
  servicePassword?: DatabaseInterfaceServicePassword;
}
