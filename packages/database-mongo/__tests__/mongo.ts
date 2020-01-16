import { ObjectID, ObjectId } from 'mongodb';
import { Mongo } from '../src/mongo';
import { DatabaseTests } from './test-utils';

const databaseTests = new DatabaseTests();

const user = {
  username: 'johndoe',
  email: 'john@doe.com',
  password: 'toto',
};

describe('Mongo', () => {
  beforeAll(databaseTests.setup);
  afterAll(databaseTests.teardown);
  beforeEach(databaseTests.beforeEach);

  describe('toMongoID', () => {
    it('should not throw when mongo id is valid', () => {
      expect(async () => {
        await databaseTests.database.findUserById('589871d1c9393d445745a57c');
      }).not.toThrow();
    });
    it('should throw when mongo id is not valid', async () => {
      const mongoTmp = new Mongo(databaseTests.db);
      await expect(mongoTmp.findUserById('invalid_hex')).rejects.toThrowError(
        'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
      );
    });
    it('should not auto convert to mongo object id when users collection has string ids', async () => {
      const mongoWithStringIds = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      const mockFindOne = jest.fn();
      (mongoWithStringIds as any).collection.findOne = mockFindOne;
      await mongoWithStringIds.findUserById('589871d1c9393d445745a57c');
      expect(mockFindOne.mock.calls[0][0]).toHaveProperty('_id', '589871d1c9393d445745a57c');
    });
  });

  describe('#constructor', () => {
    it('should have default options', () => {
      expect((databaseTests as any).database.options).toBeTruthy();
    });

    it('should overwrite options', () => {
      const mongoTestOptions = new Mongo(databaseTests.db, {
        collectionName: 'users-test',
        sessionCollectionName: 'sessions-test',
      });
      expect((mongoTestOptions as any).options).toBeTruthy();
      expect((mongoTestOptions as any).options.collectionName).toEqual('users-test');
      expect((mongoTestOptions as any).options.sessionCollectionName).toEqual('sessions-test');
    });

    it('should throw with an invalid database connection object', () => {
      expect(() => new Mongo(null as any)).toThrowError('A database connection is required');
    });
  });

  describe('setupIndexes', () => {
    it('should create indexes', async () => {
      await databaseTests.database.setupIndexes();
      const ret = await (databaseTests as any).database.collection.indexInformation();
      expect(ret).toBeTruthy();
      expect(ret._id_[0]).toEqual(['_id', 1]); // eslint-disable-line no-underscore-dangle
      expect(ret.username_1[0]).toEqual(['username', 1]);
      expect(ret['emails.address_1'][0]).toEqual(['emails.address', 1]);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userId = await databaseTests.database.createUser(user);
      const ret = await databaseTests.database.findUserById(userId);
      expect(userId).toBeTruthy();
      expect(ret).toEqual({
        _id: expect.any(ObjectID),
        id: expect.any(String),
        username: 'johndoe',
        emails: [
          {
            address: user.email,
            verified: false,
          },
        ],
        services: {
          password: {
            bcrypt: 'toto',
          },
        },
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      });
    });

    it('should not overwrite service', async () => {
      const userId = await databaseTests.database.createUser({
        ...user,
        services: 'test',
      });
      const ret = await databaseTests.database.findUserById(userId);
      expect(userId).toBeTruthy();
      expect(ret!.services).toEqual({
        password: {
          bcrypt: 'toto',
        },
      });
    });

    it('should not set password', async () => {
      const userId = await databaseTests.database.createUser({ email: user.email });
      const ret = await databaseTests.database.findUserById(userId);
      const services: any = ret!.services!;
      expect(ret!.id).toBeTruthy();
      expect(services.password).not.toBeTruthy();
    });

    it('should not set username', async () => {
      const userId = await databaseTests.database.createUser({ email: user.email });
      const ret = await databaseTests.database.findUserById(userId);
      expect(ret!.id).toBeTruthy();
      expect(ret!.username).not.toBeTruthy();
    });

    it('should not set email', async () => {
      const userId = await databaseTests.database.createUser({ username: user.username });
      const ret = await databaseTests.database.findUserById(userId);
      expect(ret!.id).toBeTruthy();
      expect(ret!.emails).not.toBeTruthy();
    });

    it('email should be lowercase', async () => {
      const userId = await databaseTests.database.createUser({ email: 'JohN@doe.com' });
      const ret = await databaseTests.database.findUserById(userId);
      expect(ret!.id).toBeTruthy();
      expect(ret!.emails![0].address).toEqual('john@doe.com');
    });

    it('call options.idProvider', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        idProvider: () => 'toto',
        convertUserIdToMongoObjectId: false,
      });
      const userId = await mongoOptions.createUser({ email: 'JohN@doe.com' });
      const ret = await mongoOptions.findUserById(userId);
      expect(userId).toBe('toto');
      expect(ret!.id).toBeTruthy();
      expect(ret!.emails![0].address).toEqual('john@doe.com');
    });
  });

  describe('findUserById', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserById('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const userId = await databaseTests.database.createUser(user);
      const ret = await databaseTests.database.findUserById(userId);
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('findUserByEmail', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserByEmail('unknow@user.com');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      await databaseTests.database.createUser(user);
      const ret = await databaseTests.database.findUserByEmail(user.email);
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });

    it('should return user with uppercase email', async () => {
      await databaseTests.database.createUser({ email: 'JOHN@DOES.COM' });
      const ret = await databaseTests.database.findUserByEmail('JOHN@DOES.COM');
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.emails![0].address).toEqual('john@does.com');
    });
  });

  describe('findUserByUsername', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserByUsername('unknowuser');
      expect(ret).not.toBeTruthy();
    });

    it('should return username for case insensitive query', async () => {
      const mongoWithOptions = new Mongo(databaseTests.db, { caseSensitiveUserName: false });
      await mongoWithOptions.createUser(user);
      const ret = await mongoWithOptions.findUserByUsername(user.username.toUpperCase());
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });

    it('should return null for incomplete matching user when using insensitive', async () => {
      const mongoWithOptions = new Mongo(databaseTests.db, { caseSensitiveUserName: false });
      const ret = await mongoWithOptions.findUserByUsername('john');
      expect(ret).not.toBeTruthy();
    });

    it('should return null when using regex wildcards when using insensitive', async () => {
      const mongoWithOptions = new Mongo(databaseTests.db, { caseSensitiveUserName: false });
      const ret = await mongoWithOptions.findUserByUsername('*');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      await databaseTests.database.createUser(user);
      const ret = await databaseTests.database.findUserByUsername(user.username);
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('findUserByServiceId', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserByServiceId('facebook', 'invalid');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const userId = await databaseTests.database.createUser(user);
      let ret = await databaseTests.database.findUserByServiceId('facebook', '1');
      expect(ret).not.toBeTruthy();
      await databaseTests.database.setService(userId, 'facebook', { id: '1' });
      ret = await databaseTests.database.findUserByServiceId('facebook', '1');
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('setUsername', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      await expect(mongoOptions.setUsername('toto', 'hey')).rejects.toThrowError('User not found');
    });

    it('should throw if user is not found', async () => {
      await expect(
        databaseTests.database.setUsername('589871d1c9393d445745a57c', 'username')
      ).rejects.toThrowError('User not found');
    });

    it('should change username', async () => {
      const username = 'johnsdoe';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.setUsername(userId, username);
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.username).toEqual(username);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });
  });

  describe('setService', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      await mongoOptions.setService('toto', 'twitter', { id: '1' });
    });

    it('should set service', async () => {
      const userId = await databaseTests.database.createUser(user);
      let ret = await databaseTests.database.findUserByServiceId('google', '1');
      expect(ret).not.toBeTruthy();
      await databaseTests.database.setService(userId, 'google', { id: '1' });
      ret = await databaseTests.database.findUserByServiceId('google', '1');
      expect(ret).toBeTruthy();
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('unsetService', () => {
    it('should not convert id', async () => {
      const collection: any = { updateOne: jest.fn() };
      const mockDb: any = { collection: () => collection };
      const mongoOptions = new Mongo(mockDb, {
        convertUserIdToMongoObjectId: false,
      });
      await mongoOptions.unsetService('toto', 'twitter');
      expect(collection.updateOne.mock.calls[0][0]._id).toBe('toto');
    });

    it('should unset service', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.setService(userId, 'telegram', { id: '1' });
      await databaseTests.database.unsetService(userId, 'telegram');
      const ret = await databaseTests.database.findUserByServiceId('telegram', '1');
      expect(ret).not.toBeTruthy();
    });
  });

  describe('setUserDeactivated', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
        idProvider: () => new ObjectId().toString(),
      });
      const userId = await mongoOptions.createUser(user);
      await mongoOptions.setUserDeactivated(userId, true);
    });

    it('should deactivate user', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.setUserDeactivated(userId, true);
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.deactivated).toBeTruthy();
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });
  });
});
