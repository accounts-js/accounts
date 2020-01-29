import { ObjectID } from 'mongodb';
import { randomBytes } from 'crypto';
import { DatabaseTests } from './test-utils';
import { MongoSessions } from '../src/sessions';

const generateRandomToken = (length = 43): string => randomBytes(length).toString('hex');

const databaseTests = new DatabaseTests();

const session = {
  userId: '123',
  ip: '127.0.0.1',
  userAgent: 'user agent',
};

describe('sessions', () => {
  beforeAll(databaseTests.setup);
  afterAll(databaseTests.teardown);
  beforeEach(databaseTests.beforeEach);

  describe('findSessionById', () => {
    it('should return null for not found session', async () => {
      // TODO create a new class
      const ret = await databaseTests.database.findSessionById('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should find session', async () => {
      const sessionId = await databaseTests.database.createSession(session.userId, 'token', {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await databaseTests.database.findSessionById(sessionId);
      expect(ret).toBeTruthy();
    });
  });

  describe('findSessionByToken', () => {
    it('should return null for not found session', async () => {
      const ret = await databaseTests.database.findSessionByToken('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should find session', async () => {
      const token = generateRandomToken();
      await databaseTests.database.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await databaseTests.database.findSessionByToken(token);
      expect(ret).toBeTruthy();
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
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.userId).toEqual(session.userId);
      expect(ret!.ip).toEqual(session.ip);
      expect(ret!.userAgent).toEqual(session.userAgent);
      expect(ret!.token).toEqual(token);
      expect(ret!.valid).toEqual(true);
      expect(ret!.createdAt).toBeTruthy();
      expect(ret!.createdAt).toEqual(new Date(ret!.createdAt).getTime());
      expect(ret!.updatedAt).toBeTruthy();
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
      expect((ret as any)._id).toBeTruthy();
      expect(ret!.userId).toEqual(session.userId);
      expect(ret!.ip).toEqual(session.ip);
      expect(ret!.userAgent).toEqual(session.userAgent);
      expect(ret!.valid).toEqual(true);
      expect(ret!.token).toEqual(token);
      expect(ret!.createdAt).toEqual(new Date(ret!.createdAt).getTime());
      expect(ret!.updatedAt).toBeTruthy();
      expect((ret as any).extraData).toEqual({ impersonatorUserId });
    });

    it('using date provider on create session', async () => {
      const mongoTestOptions = new MongoSessions(databaseTests.db, {
        dateProvider: () => new Date(),
      });
      const sessionId = await mongoTestOptions.createSession(session.userId, 'token', {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await mongoTestOptions.findSessionById(sessionId);
      expect(ret!.createdAt).toBeTruthy();
      expect(ret!.createdAt).not.toEqual(new Date(ret!.createdAt).getTime());
      expect(ret!.createdAt).toEqual(new Date(ret!.createdAt));
    });

    it('using id provider on create session', async () => {
      const mongoTestOptions = new MongoSessions(databaseTests.db, {
        idProvider: () => new ObjectID().toHexString(),
        convertSessionIdToMongoObjectId: false,
      });
      const sessionId = await mongoTestOptions.createSession(session.userId, 'token', {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await mongoTestOptions.findSessionById(sessionId);
      expect((ret as any)._id).toBeTruthy();
      expect((ret as any)._id).not.toEqual(new ObjectID((ret as any)._id));
      expect((ret as any)._id).toEqual(new ObjectID((ret as any)._id).toHexString());
    });
  });

  describe('updateSession', () => {
    it('should not convert id', async () => {
      const mongoOptions = new MongoSessions(databaseTests.db, {
        convertSessionIdToMongoObjectId: false,
      });
      await mongoOptions.updateSession('toto', { ip: 'new ip', userAgent: 'new user agent' });
    });

    it('should update session', async () => {
      const token = generateRandomToken();
      const sessionId = await databaseTests.database.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await databaseTests.database.updateSession(sessionId, {
        ip: 'new ip',
        userAgent: 'new user agent',
      });
      const ret = await databaseTests.database.findSessionById(sessionId);
      expect(ret!.userId).toEqual(session.userId);
      expect(ret!.ip).toEqual('new ip');
      expect(ret!.userAgent).toEqual('new user agent');
      expect(ret!.valid).toEqual(true);
      expect(ret!.token).toEqual(token);
      expect(ret!.createdAt).toBeTruthy();
      expect(ret!.updatedAt).toBeTruthy();
      expect(ret!.createdAt).not.toEqual(ret!.updatedAt);
    });

    it('should update session with token', async () => {
      const token = generateRandomToken();
      const token2 = generateRandomToken();
      const sessionId = await databaseTests.database.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await databaseTests.database.updateSession(
        sessionId,
        {
          ip: 'new ip',
          userAgent: 'new user agent',
        },
        token2
      );
      const ret = await databaseTests.database.findSessionById(sessionId);
      expect(ret!.userId).toEqual(session.userId);
      expect(ret!.ip).toEqual('new ip');
      expect(ret!.userAgent).toEqual('new user agent');
      expect(ret!.valid).toEqual(true);
      expect(ret!.token).toEqual(token2);
      expect(ret!.createdAt).toBeTruthy();
      expect(ret!.updatedAt).toBeTruthy();
      expect(ret!.createdAt).not.toEqual(ret!.updatedAt);
    });
  });

  describe('invalidateSession', () => {
    it('should not convert id', async () => {
      const mongoOptions = new MongoSessions(databaseTests.db, {
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
      await databaseTests.database.invalidateSession(sessionId);
      const ret = await databaseTests.database.findSessionById(sessionId);
      expect(ret!.valid).toEqual(false);
      expect(ret!.createdAt).not.toEqual(ret!.updatedAt);
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
      await databaseTests.database.invalidateAllSessions(session.userId);
      const session1 = await databaseTests.database.findSessionById(sessionId1);
      const session2 = await databaseTests.database.findSessionById(sessionId2);
      expect(session1!.valid).toEqual(false);
      expect(session1!.createdAt).not.toEqual(session1!.updatedAt);
      expect(session2!.valid).toEqual(false);
      expect(session2!.createdAt).not.toEqual(session2!.updatedAt);
    });
  });
});
