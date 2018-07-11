import * as mongodb from 'mongodb';
// tslint:disable-next-line
import { ObjectID } from 'mongodb';
import { randomBytes } from 'crypto';
import { DatabaseTests } from './database-tests';
import { Mongo } from '../src';

const databaseTests = new DatabaseTests();

const generateRandomToken = (length: number = 43): string => randomBytes(length).toString('hex');

const user = {
  username: 'johndoe',
  email: 'john@doe.com',
  password: 'toto',
  profile: {},
};
const session = {
  userId: '123',
  ip: '127.0.0.1',
  userAgent: 'user agent',
};

function delay(time) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}

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
      try {
        const mongoTmp = new Mongo(databaseTests.db);
        await mongoTmp.findUserById('invalid_hex');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(
          'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
        );
      }
    });

    it('should not auto convert to mongo object id when users collection has string ids', async () => {
      const mongoWithStringIds = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      const mockFindOne = jest.fn();
      mongoWithStringIds.collection.findOne = mockFindOne;
      await mongoWithStringIds.findUserById('589871d1c9393d445745a57c');

      expect(mockFindOne.mock.calls[0][0]).toHaveProperty('_id', '589871d1c9393d445745a57c');
    });
  });

  describe('#constructor', () => {
    it('should have default options', () => {
      expect(databaseTests.database.options).toBeTruthy();
    });

    it('should overwrite options', () => {
      const mongoTestOptions = new Mongo(databaseTests.db, {
        collectionName: 'users-test',
        sessionCollectionName: 'sessions-test',
      });
      expect(mongoTestOptions.options).toBeTruthy();
      expect(mongoTestOptions.options.collectionName).toEqual('users-test');
      expect(mongoTestOptions.options.sessionCollectionName).toEqual('sessions-test');
    });

    it('should throw with an invalid database connection object', () => {
      try {
        // tslint:disable-next-line
        new Mongo();
        throw new Error();
      } catch (err) {
        expect(err.message).toBe('A database connection is required');
      }
    });
  });

  describe('setupIndexes', () => {
    it('should create indexes', async () => {
      await databaseTests.database.setupIndexes();
      const ret = await databaseTests.database.collection.indexInformation();
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
      expect(ret._id).toBeTruthy();
      expect(ret.emails[0].address).toBe(user.email);
      expect(ret.emails[0].verified).toBe(false);
      expect(ret.createdAt).toBeTruthy();
      expect(ret.updatedAt).toBeTruthy();
    });

    it('should not set password', async () => {
      const userId = await databaseTests.database.createUser({ email: user.email });
      const ret = await databaseTests.database.findUserById(userId);
      expect(ret._id).toBeTruthy();
      expect(ret.services.password).not.toBeTruthy();
    });

    it('should not set username', async () => {
      const userId = await databaseTests.database.createUser({ email: user.email });
      const ret = await databaseTests.database.findUserById(userId);
      expect(ret._id).toBeTruthy();
      expect(ret.username).not.toBeTruthy();
    });

    it('should not set email', async () => {
      const userId = await databaseTests.database.createUser({ username: user.username });
      const ret = await databaseTests.database.findUserById(userId);
      expect(ret._id).toBeTruthy();
      expect(ret.emails).not.toBeTruthy();
    });

    it('email should be lowercase', async () => {
      const userId = await databaseTests.database.createUser({ email: 'JohN@doe.com' });
      const ret = await databaseTests.database.findUserById(userId);
      expect(ret._id).toBeTruthy();
      expect(ret.emails[0].address).toEqual('john@doe.com');
    });

    it('call options.idProvider', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        idProvider: () => 'toto',
        convertUserIdToMongoObjectId: false,
      });
      const userId = await mongoOptions.createUser({ email: 'JohN@doe.com' });
      const ret = await mongoOptions.findUserById(userId);
      expect(userId).toBe('toto');
      expect(ret._id).toBeTruthy();
      expect(ret.emails[0].address).toEqual('john@doe.com');
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
      expect(ret._id).toBeTruthy();
      expect(ret.id).toBeTruthy();
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
      expect(ret._id).toBeTruthy();
      expect(ret.id).toBeTruthy();
    });

    it('should return user with uppercase email', async () => {
      await databaseTests.database.createUser({ email: 'JOHN@DOES.COM' });
      const ret = await databaseTests.database.findUserByEmail('JOHN@DOES.COM');
      expect(ret._id).toBeTruthy();
      expect(ret.emails[0].address).toEqual('john@does.com');
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
      expect(ret._id).toBeTruthy();
      expect(ret.id).toBeTruthy();
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
      expect(ret._id).toBeTruthy();
      expect(ret.id).toBeTruthy();
    });
  });

  describe('findUserByEmailVerificationToken', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserByEmailVerificationToken('token');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmailVerificationToken(userId, 'john@doe.com', 'token');
      const ret = await databaseTests.database.findUserByEmailVerificationToken('token');
      expect(ret).toBeTruthy();
      expect(ret._id).toBeTruthy();
      expect(ret.id).toBeTruthy();
    });
  });

  describe('findUserByResetPasswordToken', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserByResetPasswordToken('token');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addResetPasswordToken(userId, 'john@doe.com', 'token');
      const ret = await databaseTests.database.findUserByResetPasswordToken('token');
      expect(ret).toBeTruthy();
      expect(ret._id).toBeTruthy();
      expect(ret.id).toBeTruthy();
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
      expect(ret._id).toBeTruthy();
      expect(ret.id).toBeTruthy();
    });
  });

  describe('findPasswordHash', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      await mongoOptions.findPasswordHash('toto');
    });

    it('should return null on not found user', async () => {
      const ret = await databaseTests.database.findPasswordHash('589871d1c9393d445745a57c');
      expect(ret).toEqual(null);
    });

    it('should return hash', async () => {
      const userId = await databaseTests.database.createUser(user);
      const retUser = await databaseTests.database.findUserById(userId);
      const ret = await databaseTests.database.findPasswordHash(userId);
      expect(ret).toBeTruthy();
      expect(ret).toEqual(retUser.services.password.bcrypt);
    });
  });

  describe('addEmail', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      const userId = await mongoOptions.createUser(user);
      await mongoOptions.addEmail(userId, 'hey', false);
    });

    it('should throw if user is not found', async () => {
      try {
        await databaseTests.database.addEmail('589871d1c9393d445745a57c', 'unknowemail', false);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should add email', async () => {
      const email = 'johns@doe.com';
      const userId = await databaseTests.database.createUser(user);
      await delay(10);
      await databaseTests.database.addEmail(userId, email, false);
      const retUser = await databaseTests.database.findUserByEmail(email);
      expect(retUser.emails.length).toEqual(2);
      expect(retUser.createdAt).not.toEqual(retUser.updatedAt);
    });

    it('should add lowercase email', async () => {
      const email = 'johnS@doe.com';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmail(userId, email, false);
      const retUser = await databaseTests.database.findUserByEmail(email);
      expect(retUser.emails.length).toEqual(2);
      expect(retUser.emails[1].address).toEqual('johns@doe.com');
    });
  });

  describe('removeEmail', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      const userId = await mongoOptions.createUser(user);
      await mongoOptions.removeEmail(userId, 'hey');
    });

    it('should throw if user is not found', async () => {
      try {
        await databaseTests.database.removeEmail('589871d1c9393d445745a57c', 'unknowemail');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should remove email', async () => {
      const email = 'johns@doe.com';
      const userId = await databaseTests.database.createUser(user);
      await delay(10);
      await databaseTests.database.addEmail(userId, email, false);
      await databaseTests.database.removeEmail(userId, user.email, false);
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser.emails.length).toEqual(1);
      expect(retUser.emails[0].address).toEqual(email);
      expect(retUser.createdAt).not.toEqual(retUser.updatedAt);
    });

    it('should remove uppercase email', async () => {
      const email = 'johns@doe.com';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmail(userId, email, false);
      await databaseTests.database.removeEmail(userId, 'JOHN@doe.com', false);
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser.emails.length).toEqual(1);
      expect(retUser.emails[0].address).toEqual(email);
    });
  });

  describe('verifyEmail', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      try {
        await mongoOptions.verifyEmail('toto', 'hey');
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should throw if user is not found', async () => {
      try {
        await databaseTests.database.verifyEmail('589871d1c9393d445745a57c', 'unknowemail');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should verify email', async () => {
      const userId = await databaseTests.database.createUser(user);
      await delay(10);
      let retUser = await databaseTests.database.findUserById(userId);
      expect(retUser.emails.length).toEqual(1);
      expect(retUser.emails[0].address).toBe(user.email);
      expect(retUser.emails[0].verified).toBe(false);
      await databaseTests.database.verifyEmail(userId, user.email);
      retUser = await databaseTests.database.findUserById(userId);
      expect(retUser.emails.length).toEqual(1);
      expect(retUser.emails[0].address).toBe(user.email);
      expect(retUser.emails[0].verified).toBe(true);
      expect(retUser.createdAt).not.toEqual(retUser.updatedAt);
    });
  });

  describe('setUsername', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      try {
        await mongoOptions.setUsername('toto', 'hey');
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should throw if user is not found', async () => {
      try {
        await databaseTests.database.setUsername('589871d1c9393d445745a57c');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should change username', async () => {
      const username = 'johnsdoe';
      const userId = await databaseTests.database.createUser(user);
      await delay(10);
      await databaseTests.database.setUsername(userId, username);
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser.username).toEqual(username);
      expect(retUser.createdAt).not.toEqual(retUser.updatedAt);
    });
  });

  describe('setPassword', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      try {
        await mongoOptions.setPassword('toto', 'hey');
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should throw if user is not found', async () => {
      try {
        await databaseTests.database.setPassword('589871d1c9393d445745a57c', 'toto');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should change password', async () => {
      const newPassword = 'newpass';
      const userId = await databaseTests.database.createUser(user);
      await delay(10);
      await databaseTests.database.setPassword(userId, newPassword);
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser.services.password.bcrypt).toBeTruthy();
      expect(retUser.services.password.bcrypt).toEqual(newPassword);
      expect(retUser.createdAt).not.toEqual(retUser.updatedAt);
    });
  });

  describe('setProfile', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertUserIdToMongoObjectId: false,
      });
      await mongoOptions.setProfile('toto', { username: 'toto' });
    });

    it('should change profile', async () => {
      const userId = await databaseTests.database.createUser(user);
      await delay(10);
      const retUser = await databaseTests.database.setProfile(userId, { username: 'toto' });
      expect(retUser.username).toEqual('toto');
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
      expect(ret._id).toBeTruthy();
      expect(ret.id).toBeTruthy();
    });
  });

  describe('unsetService', () => {
    it('should not convert id', async () => {
      const collection: any = { update: jest.fn() };
      const mockDb: any = { collection: () => collection };
      const mongoOptions = new Mongo(mockDb, {
        convertUserIdToMongoObjectId: false,
      });
      await mongoOptions.unsetService('toto', 'twitter');
      expect(collection.update.mock.calls[0][0]._id).toBe('toto');
    });

    it('should unset service', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.setService(userId, 'telegram', { id: '1' });
      await databaseTests.database.unsetService(userId, 'telegram');
      const ret = await databaseTests.database.findUserByServiceId('telegram', '1');
      expect(ret).not.toBeTruthy();
    });
  });

  describe('createSession', () => {
    it('should create session', async () => {
      const token = generateRandomToken();
      const sessionId = await databaseTests.database.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await databaseTests.database.findSessionById(sessionId);
      expect(ret).toBeTruthy();
      expect(ret._id).toBeTruthy();
      expect(ret.userId).toEqual(session.userId);
      expect(ret.ip).toEqual(session.ip);
      expect(ret.userAgent).toEqual(session.userAgent);
      expect(ret.token).toEqual(token);
      expect(ret.valid).toEqual(true);
      expect(ret.createdAt).toBeTruthy();
      expect(ret.createdAt).toEqual(new Date(ret.createdAt).getTime());
      expect(ret.updatedAt).toBeTruthy();
    });

    it('should create session with extra data', async () => {
      const impersonatorUserId = '789';
      const token = generateRandomToken();
      const sessionId = await databaseTests.database.createSession(
        session.userId,
        token,
        { ip: session.ip, userAgent: session.userAgent },
        { impersonatorUserId }
      );
      const ret = await databaseTests.database.findSessionById(sessionId);
      expect(ret).toBeTruthy();
      expect(ret._id).toBeTruthy();
      expect(ret.userId).toEqual(session.userId);
      expect(ret.ip).toEqual(session.ip);
      expect(ret.userAgent).toEqual(session.userAgent);
      expect(ret.valid).toEqual(true);
      expect(ret.token).toEqual(token);
      expect(ret.createdAt).toEqual(new Date(ret.createdAt).getTime());
      expect(ret.updatedAt).toBeTruthy();
      expect(ret.extraData).toEqual({ impersonatorUserId });
    });

    it('using date provider on create session', async () => {
      const mongoTestOptions = new Mongo(databaseTests.db, {
        dateProvider: () => new Date(),
      });
      const sessionId = await mongoTestOptions.createSession(
        session.userId,
        session.ip,
        session.userAgent
      );
      const ret = await mongoTestOptions.findSessionById(sessionId);
      expect(ret.createdAt).toBeTruthy();
      expect(ret.createdAt).not.toEqual(new Date(ret.createdAt).getTime());
      expect(ret.createdAt).toEqual(new Date(ret.createdAt));
    });

    it('using id provider on create session', async () => {
      const mongoTestOptions = new Mongo(databaseTests.db, {
        idProvider: () => new ObjectID().toHexString(),
        convertSessionIdToMongoObjectId: false,
      });
      const sessionId = await mongoTestOptions.createSession(
        session.userId,
        session.ip,
        session.userAgent
      );
      const ret = await mongoTestOptions.findSessionById(sessionId);
      expect(ret._id).toBeTruthy();
      expect(ret._id).not.toEqual(new ObjectID(ret._id));
      expect(ret._id).toEqual(new ObjectID(ret._id).toHexString());
    });
  });

  describe('findSessionByToken', () => {
    it('should return null for not found session', async () => {
      const ret = await databaseTests.database.findSessionByToken('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should find session', async () => {
      const token = generateRandomToken();
      const sessionId = await databaseTests.database.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await databaseTests.database.findSessionByToken(token);
      expect(ret).toBeTruthy();
    });
  });

  describe('findSessionById', () => {
    it('should return null for not found session', async () => {
      const ret = await databaseTests.database.findSessionById('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should find session', async () => {
      const sessionId = await databaseTests.database.createSession(session);
      const ret = await databaseTests.database.findSessionById(sessionId);
      expect(ret).toBeTruthy();
    });
  });

  describe('updateSession', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertSessionIdToMongoObjectId: false,
      });
      await mongoOptions.updateSession('toto', 'new ip', 'new user agent');
    });

    it('should update session', async () => {
      const token = generateRandomToken();
      const sessionId = await databaseTests.database.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await delay(10);
      await databaseTests.database.updateSession(sessionId, {
        ip: 'new ip',
        userAgent: 'new user agent',
      });
      const ret = await databaseTests.database.findSessionById(sessionId);
      expect(ret.userId).toEqual(session.userId);
      expect(ret.ip).toEqual('new ip');
      expect(ret.userAgent).toEqual('new user agent');
      expect(ret.valid).toEqual(true);
      expect(ret.token).toEqual(token);
      expect(ret.createdAt).toBeTruthy();
      expect(ret.updatedAt).toBeTruthy();
      expect(ret.createdAt).not.toEqual(ret.updatedAt);
    });
  });

  describe('invalidateSession', () => {
    it('should not convert id', async () => {
      const mongoOptions = new Mongo(databaseTests.db, {
        convertSessionIdToMongoObjectId: false,
      });
      await mongoOptions.invalidateSession('toto');
    });

    it('invalidates a session', async () => {
      const token = generateRandomToken();
      const sessionId = await databaseTests.database.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await delay(10);
      await databaseTests.database.invalidateSession(sessionId);
      const ret = await databaseTests.database.findSessionById(sessionId);
      expect(ret.valid).toEqual(false);
      expect(ret.createdAt).not.toEqual(ret.updatedAt);
    });
  });

  describe('invalidateAllSessions', () => {
    it('invalidates all sessions', async () => {
      const sessionId1 = await databaseTests.database.createSession(
        session.userId,
        generateRandomToken(),
        {
          ip: session.ip,
          userAgent: session.userAgent,
        }
      );
      const sessionId2 = await databaseTests.database.createSession(
        session.userId,
        generateRandomToken(),
        {
          ip: session.ip,
          userAgent: session.userAgent,
        }
      );
      await delay(10);
      await databaseTests.database.invalidateAllSessions(session.userId);
      const session1 = await databaseTests.database.findSessionById(sessionId1);
      const session2 = await databaseTests.database.findSessionById(sessionId2);
      expect(session1.valid).toEqual(false);
      expect(session1.createdAt).not.toEqual(session1.updatedAt);
      expect(session2.valid).toEqual(false);
      expect(session2.createdAt).not.toEqual(session2.updatedAt);
    });
  });

  describe('addEmailVerificationToken', () => {
    it('should add a token', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmailVerificationToken(userId, 'john@doe.com', 'token');
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser.services.email.verificationTokens.length).toEqual(1);
      expect(retUser.services.email.verificationTokens[0].address).toEqual('john@doe.com');
      expect(retUser.services.email.verificationTokens[0].token).toEqual('token');
      expect(retUser.services.email.verificationTokens[0].when).toBeTruthy();
    });
  });

  describe('addResetPasswordToken', () => {
    it('should add a token', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addResetPasswordToken(userId, 'john@doe.com', 'token', 'reset');
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser.services.password.reset.length).toEqual(1);
      expect(retUser.services.password.reset[0].address).toEqual('john@doe.com');
      expect(retUser.services.password.reset[0].token).toEqual('token');
      expect(retUser.services.password.reset[0].when).toBeTruthy();
      expect(retUser.services.password.reset[0].reason).toEqual('reset');
    });
  });

  describe('setResetPassword', () => {
    it('should change password', async () => {
      const newPassword = 'newpass';
      const userId = await databaseTests.database.createUser(user);
      await delay(10);
      await databaseTests.database.setResetPassword(userId, 'toto', newPassword);
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser.services.password.bcrypt).toBeTruthy();
      expect(retUser.services.password.bcrypt).toEqual(newPassword);
      expect(retUser.createdAt).not.toEqual(retUser.updatedAt);
    });
  });
});
