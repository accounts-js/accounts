import { User } from './user';
import { DatabaseInterface } from './database-interface';

// TODO : Fix circular dependency for better type checking
// import AccountsServer from '@accounts/server';

export interface AuthenticationService {
  server: any;
  serviceName: string;
  link(accountsServer: any): ThisType<AuthenticationService>;
  setStore(store: DatabaseInterface): void;
  authenticate(params: any): Promise<User | null>;
}

export interface AuthenticationServices {
  [key: string]: AuthenticationService
}