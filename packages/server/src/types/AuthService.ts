import { UserObjectType } from '@accounts/common';
import { DBInterface } from './DBInterface'

import { AccountsServer } from '../AccountsServer';

export interface AuthService {
  server: AccountsServer;
  serviceName: string;
  setStore(store: DBInterface): void;
  authenticate(params: any): Promise<UserObjectType | null>;
}