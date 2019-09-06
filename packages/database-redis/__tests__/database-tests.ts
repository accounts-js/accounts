import { runDatabaseTests } from '@accounts/database-tests';
import * as IORedis from 'ioredis';

import { RedisSessions } from '../src/redis';

export class DatabaseTests {
  public database!: RedisSessions;
  private redis!: IORedis.Redis;

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
    this.redis = new IORedis({
      lazyConnect: true,
    });
    await this.redis.connect();
    this.database = new RedisSessions(this.redis);
  };

  public closeConnection = async () => {
    await this.redis.disconnect();
  };

  public dropDatabase = async () => {
    const keys = await this.redis.keys('*');
    const pipeline = this.redis.pipeline();
    keys.forEach(key => {
      pipeline.del(key);
    });
    await pipeline.exec();
  };
}

runDatabaseTests(new DatabaseTests());
