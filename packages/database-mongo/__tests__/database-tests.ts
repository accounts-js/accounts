import * as mongodb from 'mongodb';
import { runDatabaseTests } from '@accounts/database-tests';
import { Mongo } from '../src';

class DatabaseTests {
  public database: Mongo;
  private client: mongodb.MongoClient;
  private db: mongodb.Db;

  public setup = async () => {
    await this.createConnection();
  }

  public teardown = async () => {
    await this.dropDatabase();
    await this.closeConnection();
  }

  public beforeEach = async () => {
    await this.dropDatabase();
  }

  public async createConnection() {
    const url = 'mongodb://localhost:27017';
    this.client = await mongodb.MongoClient.connect(url);
    this.db = this.client.db('accounts-mongo-tests');
    this.database = new Mongo(this.db, {
      convertUserIdToMongoObjectId: false,
      convertSessionIdToMongoObjectId: false,
    });
  }

  public closeConnection = async () => {
    await this.client.close();
  }

  public dropDatabase = async () => {
    await this.db.dropDatabase();
  }
}

runDatabaseTests(new DatabaseTests());