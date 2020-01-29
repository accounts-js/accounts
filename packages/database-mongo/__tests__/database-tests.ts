import { ObjectId } from 'mongodb';
import { runDatabaseTests } from '@accounts/database-tests';
import { DatabaseTests } from './test-utils';

runDatabaseTests(
  new DatabaseTests({
    convertUserIdToMongoObjectId: false,
    convertSessionIdToMongoObjectId: false,
    idProvider: () => new ObjectId().toString(),
  })
);
