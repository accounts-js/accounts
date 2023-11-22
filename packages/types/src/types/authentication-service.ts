import { type User } from './user';
import { type DatabaseInterfaceUser } from './user/database-interface';
import { type DatabaseInterfaceSessions } from './session/database-interface';

// TODO : Fix circular dependency for better type checking
// import AccountsServer from '@accounts/server';

export interface AuthenticationService<CustomUser extends User = User> {
  server: any;
  serviceName: string;
  setUserStore(store: DatabaseInterfaceUser<CustomUser>): void;
  setSessionsStore(store: DatabaseInterfaceSessions): void;
  authenticate(params: any): Promise<CustomUser | null>;
}
