import 'reflect-metadata';
import { type Db, MongoClient, ObjectId } from 'mongodb';
import { runDatabaseTests } from '@accounts/database-tests';
import { Mongo } from '../src';

export class DatabaseTests {
  public database!: Mongo;
  public db!: Db;
  public client!: MongoClient;
  private options: any;

  constructor(options?: any) {
    this.options = options;
  }

  public setup = async () => {
    await this.createConnection();
  };

  public teardown = async () => {
    await this.dropDatabase();
    await this.closeConnection();
  };

  public beforeEach = async () => {
    await this.dropDatabase();
  };

  public createConnection = async () => {
    const url = 'mongodb://localhost:27017';
    this.client = await MongoClient.connect(url);
    this.db = this.client.db('accounts-mongo-tests');
    this.database = new Mongo(this.db, this.options);
  };

  public closeConnection = async () => {
    await this.client.close();
  };

  public dropDatabase = async () => {
    await this.db.dropDatabase();
  };
}

runDatabaseTests(
  new DatabaseTests({
    convertUserIdToMongoObjectId: false,
    idProvider: () => new ObjectId().toString(),
    convertSessionIdToMongoObjectId: false,
    idSessionProvider: () => new ObjectId().toString(),
  })
);
