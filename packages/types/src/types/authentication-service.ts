import { User } from './user';
import { DatabaseInterface } from './database-interface';
import { ConnectionInformations } from './connection-informations';

// TODO : Fix circular dependency for better type checking
// import AccountsServer from '@accounts/server';

export interface AuthenticationService<CustomUser extends User = User> {
  server: any;
  serviceName: string;
  setStore(store: DatabaseInterface): void;
  authenticate(params: any, infos: ConnectionInformations): Promise<CustomUser | null>;
}
