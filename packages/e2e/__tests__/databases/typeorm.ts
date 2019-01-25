import { ConnectionManager, Connection, ConnectionOptions } from 'typeorm';
import { DatabaseInterface } from '@accounts/types';
import { AccountsTypeorm, entities } from '@accounts/typeorm';
import { DatabaseTestInterface } from './index';

const connectionName = 'typeorm-accounts-js-test';
const connectionConfig: ConnectionOptions = {
  name: connectionName,
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'accounts-js',
  entities,
  password: '',
  database: 'accounts-js-tests-e2e',
};

export class DatabaseTest implements DatabaseTestInterface {
  public connectionManager = new ConnectionManager();
  public accountsDatabase: DatabaseInterface;
  public connection: Connection;

  constructor() {
    this.connection = this.connectionManager.create(connectionConfig);
    this.accountsDatabase = new AccountsTypeorm({
      connection: this.connection,
    });
  }

  public async start() {
    await this.connection.connect();
    await this.connection.synchronize();
  }

  public async stop() {
    if (this.connection.isConnected) {
      await this.connection.close();
    }
  }
}
