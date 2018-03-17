import { User } from './user';
import { DatabaseInterface } from './database-interface';

import AccountsServer from '@accounts/server';

export interface AuthenticationService {
  server: AccountsServer;
  serviceName: string;
  setStore(store: DatabaseInterface): void;
  authenticate(params: any): Promise<User | null>;
}
