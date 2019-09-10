import { Connection, createConnection } from 'typeorm';

import { AccountsTypeorm } from '../src';
import { User } from '../src/entity/User';
import { UserEmail } from '../src/entity/UserEmail';
import { UserService } from '../src/entity/UserService';
import { UserSession } from '../src/entity/UserSession';

const database = 'accounts-js-tests-e2e';

export class DatabaseTests {
  public database!: AccountsTypeorm;
  public connection: Connection | undefined;
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
    this.connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      entities: [User, UserEmail, UserService, UserSession],
      username: 'postgres',
      password: '',
      database,
      synchronize: true,
    });

    this.database = new AccountsTypeorm({
      connection: this.connection,
      ...this.options,
    });
  };

  public closeConnection = async () => {
    if (this.connection) {
      await this.connection.close();
    }
  };

  public dropDatabase = async () => {
    if (this.connection) {
      await this.connection.dropDatabase();
      await this.connection.synchronize();
    }
  };
}

describe('DatabaseTest', () => {
  it('should have instance', () => {
    expect(DatabaseTests).toBeTruthy();
  });
});
