import mongoose from 'mongoose';
import { DatabaseInterface } from '@accounts/types';
// TODO rename to AccountsMongo ?
import { Mongo } from '@accounts/mongo';
import { DatabaseTestInterface } from './index';

const connectionString = 'mongodb://localhost/accounts-js-tests-e2e';

export class DatabaseTest implements DatabaseTestInterface {
  public accountsDatabase: DatabaseInterface;

  constructor() {
    this.accountsDatabase = new Mongo(mongoose.connection);
  }

  public async start() {
    (mongoose as any).Promise = global.Promise;
    await mongoose.connect(connectionString);
    await mongoose.connection.dropDatabase();
  }

  public async stop() {
    await mongoose.connection.close();
  }
}
