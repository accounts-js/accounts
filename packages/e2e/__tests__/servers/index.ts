import { DatabaseInterface } from '@accounts/types';
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { ServerGraphqlTest } from './server-graphql';
import { ServerRestTest } from './server-rest';

export const servers: {
  [key: string]: ServerTestInterface;
} = {
  'server-graphql': new ServerGraphqlTest(),
  'server-rest': new ServerRestTest(),
};

export interface ServerTestInterface {
  port: number;

  accountsDatabase: DatabaseInterface;

  /**
   * The client
   */
  accountsClient: AccountsClient;
  /**
   * The client password service
   */
  accountsClientPassword: AccountsClientPassword;

  emails: any[];

  /**
   * - create server
   * - setup databases connections
   * - cleanup database
   * - initiate the accounts-js server and the services
   */
  start: () => Promise<void>;
  /**
   * - stop server
   * - stop databases connection
   * - cleanup database
   */
  stop: () => Promise<void>;
}
