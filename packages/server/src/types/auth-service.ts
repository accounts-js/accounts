import { UserObjectType } from '@accounts/common';
import { DBInterface } from './db-interface';

import { AccountsServer } from '../accounts-server';

export interface AuthService {
  server: AccountsServer;
  serviceName: string;
  setStore(store: DBInterface): void;
  authenticate(params: any): Promise<UserObjectType | null>;
}
