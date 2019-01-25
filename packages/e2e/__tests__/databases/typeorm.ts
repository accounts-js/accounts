import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { DatabaseInterface } from '@accounts/types';
import { AccountsTypeorm } from '@accounts/typeorm';
import { DatabaseTestInterface } from './index';

const connectionConfig: ConnectionOptions = {
  name: 'typeorm-accounts-js-test',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'accounts-js',
  password: '',
  database: 'accounts-js-tests-e2e',
};

export class DatabaseTest implements DatabaseTestInterface {
  public accountsDatabase: DatabaseInterface;
  public connection: Connection | null = null;

  constructor() {
    this.accountsDatabase = new AccountsTypeorm({
      connectionName: 'typeorm-accounts-js-test',
    });
  }

  public async start() {
    this.connection = await createConnection(connectionConfig);
  }

  public async stop() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}
