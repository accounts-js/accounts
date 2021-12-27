import { randomBytes } from 'crypto';
import { MongoClient, Db, ObjectID } from 'mongodb';
import { MongoSessions } from '../src/mongo-sessions';

const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const generateRandomToken = (length = 43): string => randomBytes(length).toString('hex');

const session = {
  userId: '123',
  ip: '127.0.0.1',
  userAgent: 'user agent',
};

describe('MongoSessions', () => {
  let connection: MongoClient;
  let database: Db;

  beforeAll(async () => {
    const url = 'mongodb://localhost:27017';
    connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    database = await connection.db('accounts-mongo-sessions-tests');
  });

  beforeEach(async () => {
    await database.collection('sessions').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('#constructor', () => {
    it('should have default options', () => {
      const mongoSessions = new MongoSessions({ database });
      expect((mongoSessions as any).options).toBeTruthy();
    });

    it('should overwrite options', () => {
      const mongoSessions = new MongoSessions({
        database,
        sessionCollectionName: 'sessionsTest',
      });
      expect((mongoSessions as any).options.sessionCollectionName).toEqual('sessionsTest');
    });
  });

  describe('setupIndexes', () => {
    it('should create indexes', async () => {
      const mongoSessions = new MongoSessions({ database });
      await mongoSessions.setupIndexes();
      const ret = await database.collection('sessions').indexInformation();
      expect(ret).toEqual({
        _id_: [['_id', 1]],
        token_1: [['token', 1]],
      });
    });
  });

  describe('createSession', () => {
    it('should create session', async () => {
      const mongoSessions = new MongoSessions({ database });
      const token = generateRandomToken();
      const sessionId = await mongoSessions.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await mongoSessions.findSessionById(sessionId);
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
      const mongoSessions = new MongoSessions({ database });
      const impersonatorUserId = '789';
      const token = generateRandomToken();
      const sessionId = await mongoSessions.createSession(
        session.userId,
        token,
        { ip: session.ip, userAgent: session.userAgent },
        { impersonatorUserId }
      );
      const ret = await mongoSessions.findSessionById(sessionId);
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
      const mongoSessions = new MongoSessions({ database, dateProvider: () => new Date() });
      const sessionId = await mongoSessions.createSession(session.userId, 'token', {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await mongoSessions.findSessionById(sessionId);
      expect(ret!.createdAt).toBeTruthy();
      expect(ret!.createdAt).not.toEqual(new Date(ret!.createdAt).getTime());
      expect(ret!.createdAt).toEqual(new Date(ret!.createdAt));
    });

    it('using id provider on create session', async () => {
      const mongoSessions = new MongoSessions({
        database,
        idProvider: () => new ObjectID().toHexString(),
        convertSessionIdToMongoObjectId: false,
      });
      const sessionId = await mongoSessions.createSession(session.userId, 'token', {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await mongoSessions.findSessionById(sessionId);
      expect((ret as any)._id).toBeTruthy();
      expect((ret as any)._id).not.toEqual(new ObjectID((ret as any)._id));
      expect((ret as any)._id).toEqual(new ObjectID((ret as any)._id).toHexString());
    });

    it('using id provider and convertSessionIdToMongoObjectId on create session', async () => {
      const mongoSessions = new MongoSessions({
        database,
        convertSessionIdToMongoObjectId: true,
        idSessionProvider: () => `someprefix|${new ObjectID().toString()}`,
      });
      const sessionId = await mongoSessions.createSession(session.userId, 'token', {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await mongoSessions.findSessionById(sessionId);
      expect((ret as any)._id).toBeTruthy();
      expect((ret as any)._id).toBeInstanceOf(ObjectID);
    });

    it('using id provider should show deprecation warning', async () => {
      const consoleSpy = jest.spyOn(console, 'warn');
      new MongoSessions({
        database,
        convertSessionIdToMongoObjectId: false,
        idProvider: () => `someprefix|${new ObjectID().toString()}`,
      });
      expect(consoleSpy).toBeCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Deprecation'));
      consoleSpy.mockRestore();
    });

    it('using both idSessionProvider and convertToMongoObject Id should show warning', async () => {
      const consoleSpy = jest.spyOn(console, 'warn');
      new MongoSessions({
        database,
        convertSessionIdToMongoObjectId: true,
        idSessionProvider: () => `someprefix|${new ObjectID().toString()}`,
      });
      expect(consoleSpy).toBeCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('set both'));
      consoleSpy.mockRestore();
    });
  });

  describe('findSessionById', () => {
    it('should return null for not found session', async () => {
      const mongoSessions = new MongoSessions({ database });
      const ret = await mongoSessions.findSessionById('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should find session', async () => {
      const mongoSessions = new MongoSessions({ database });
      const sessionId = await mongoSessions.createSession(session as any, 'token');
      const ret = await mongoSessions.findSessionById(sessionId);
      expect(ret).toBeTruthy();
    });
  });

  describe('findSessionByToken', () => {
    it('should return null for not found session', async () => {
      const mongoSessions = new MongoSessions({ database });
      const ret = await mongoSessions.findSessionByToken('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should find session', async () => {
      const mongoSessions = new MongoSessions({ database });
      const token = generateRandomToken();
      await mongoSessions.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await mongoSessions.findSessionByToken(token);
      expect(ret).toBeTruthy();
    });
  });

  describe('updateSession', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should not convert id', async () => {
      const mongoSessions = new MongoSessions({ database, convertSessionIdToMongoObjectId: false });
      expect(
        async () =>
          await mongoSessions.updateSession('toto', { ip: 'new ip', userAgent: 'new user agent' })
      ).not.toThrowError();
    });

    it('should update session', async () => {
      const mongoSessions = new MongoSessions({ database });
      const token = generateRandomToken();
      const sessionId = await mongoSessions.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await delay(10);
      await mongoSessions.updateSession(sessionId, {
        ip: 'new ip',
        userAgent: 'new user agent',
      });
      const ret = await mongoSessions.findSessionById(sessionId);
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
      const mongoSessions = new MongoSessions({ database });
      const token = generateRandomToken();
      const token2 = generateRandomToken();
      const sessionId = await mongoSessions.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await delay(10);
      await mongoSessions.updateSession(
        sessionId,
        {
          ip: 'new ip',
          userAgent: 'new user agent',
        },
        token2
      );
      const ret = await mongoSessions.findSessionById(sessionId);
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
    // eslint-disable-next-line jest/expect-expect
    it('should not convert id', async () => {
      const mongoSessions = new MongoSessions({ database, convertSessionIdToMongoObjectId: false });
      expect(async () => await mongoSessions.invalidateSession('toto')).not.toThrowError();
    });

    it('invalidates a session', async () => {
      const mongoSessions = new MongoSessions({ database });
      const token = generateRandomToken();
      const sessionId = await mongoSessions.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await delay(10);
      await mongoSessions.invalidateSession(sessionId);
      const ret = await mongoSessions.findSessionById(sessionId);
      expect(ret!.valid).toEqual(false);
      expect(ret!.createdAt).not.toEqual(ret!.updatedAt);
    });
  });

  describe('invalidateAllSessions', () => {
    it('invalidates all sessions', async () => {
      const mongoSessions = new MongoSessions({ database });
      const sessionId1 = await mongoSessions.createSession(session.userId, generateRandomToken(), {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const sessionId2 = await mongoSessions.createSession(session.userId, generateRandomToken(), {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await delay(10);
      await mongoSessions.invalidateAllSessions(session.userId);
      const session1 = await mongoSessions.findSessionById(sessionId1);
      const session2 = await mongoSessions.findSessionById(sessionId2);
      expect(session1!.valid).toEqual(false);
      expect(session1!.createdAt).not.toEqual(session1!.updatedAt);
      expect(session2!.valid).toEqual(false);
      expect(session2!.createdAt).not.toEqual(session2!.updatedAt);
    });

    it('invalidates all sessions except given list', async () => {
      const mongoSessions = new MongoSessions({ database });
      const sessionId1 = await mongoSessions.createSession(session.userId, generateRandomToken(), {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const sessionId2 = await mongoSessions.createSession(session.userId, generateRandomToken(), {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const sessionId3 = await mongoSessions.createSession(session.userId, generateRandomToken(), {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const sessionId4 = await mongoSessions.createSession(session.userId, generateRandomToken(), {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await delay(10);
      await mongoSessions.invalidateAllSessions(session.userId, [sessionId2, sessionId4]);

      const session1 = await mongoSessions.findSessionById(sessionId1);
      const session2 = await mongoSessions.findSessionById(sessionId2);
      const session3 = await mongoSessions.findSessionById(sessionId3);
      const session4 = await mongoSessions.findSessionById(sessionId4);

      expect(session1!.valid).toEqual(false);
      expect(session2!.valid).toEqual(true);
      expect(session3!.valid).toEqual(false);
      expect(session4!.valid).toEqual(true);
    });
  });
});
