import { AccountsTypeorm, entities } from 'darkbasic-accounts-typeorm';
import { DatabaseInterface } from '@accounts/types';
import { Connection, ConnectionManager, ConnectionOptions } from 'typeorm';
import { createAccountsTypeORMModule } from '@accounts/module-typeorm';

import { DatabaseTestInterface } from '.';
import { Module } from 'graphql-modules';

const connectionName = 'typeorm-accounts-js-test';
const connectionConfig: ConnectionOptions = {
  name: connectionName,
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  entities,
  password: '',
  database: 'accounts-js-tests-e2e',
};

export class DatabaseTest implements DatabaseTestInterface {
  public connectionManager = new ConnectionManager();
  public accountsDatabase: DatabaseInterface;
  public connection: Connection;
  public databaseModule: Module;

  constructor() {
    this.connection = this.connectionManager.create(connectionConfig);
    this.databaseModule = createAccountsTypeORMModule({ connection: this.connection });
    this.accountsDatabase = new AccountsTypeorm({}, this.connection);
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
