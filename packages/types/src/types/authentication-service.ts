import { User } from './user';
import { DatabaseInterface } from './database-interface';
import { OAuthProvider, ConnectionInformations } from '..';

// TODO : Fix circular dependency for better type checking
// import AccountsServer from '@accounts/server';

export interface AuthenticationService {
  server: any;
  serviceName: string;
  link(accountsServer: any): ThisType<AuthenticationService>;
  setStore(store: DatabaseInterface): void;
  authenticate(params: any, connectionInfo: ConnectionInformations, provider?: OAuthProvider): Promise<User | null>;
}

export interface AuthenticationServices {
  [key: string]: AuthenticationService
}