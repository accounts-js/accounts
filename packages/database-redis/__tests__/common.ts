import { randomBytes } from 'crypto';
import * as IORedis from 'ioredis';
import { runDatabaseTests } from '@accounts/database-tests';
import { Redis } from '../src/redis';

const dropDatabase = async database => {
  const keys = await database.keys('*');
  const pipeline = database.pipeline();
  keys.forEach(key => {
    pipeline.del(key);
  });
  await pipeline.exec();
};

describe('redis', () => {
  const database = new IORedis();
  const redis = new Redis(database);

  beforeEach(async () => {
    await dropDatabase(database);
  });

  afterAll(async () => {
    await dropDatabase(database);
    database.disconnect();
  });

  runDatabaseTests(redis);
});
