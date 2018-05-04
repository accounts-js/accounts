import { randomBytes } from 'crypto';
import * as IORedis from 'ioredis';
import { DatabaseInterface } from '@accounts/types';
import { Redis } from '../src/redis';

const generateRandomToken = (length: number = 43): string => randomBytes(length).toString('hex');

function delay(time) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}

const runDatabaseTests = (database: DatabaseInterface) => {
  const token = generateRandomToken();
  const token2 = generateRandomToken();

  const session = {
    userId: '123',
    ip: '127.0.0.1',
    userAgent: 'user agent',
  };

  const connectionInfo = {
    ip: '127.0.0.1',
    userAgent: 'user agent',
  };

  describe('sessions', () => {
    describe('createSession', () => {
      it('should create session', async () => {
        const sessionId = await database.createSession(session.userId, token, {
          ip: session.ip,
          userAgent: session.userAgent,
        });
        const resultSession = await database.findSessionById(sessionId);
        expect(resultSession.id).toBeTruthy();
        expect(resultSession.userId).toEqual(session.userId);
        expect(resultSession.ip).toEqual(session.ip);
        expect(resultSession.userAgent).toEqual(session.userAgent);
        expect(resultSession.token).toEqual(token);
        expect(resultSession.valid).toEqual(true);
        expect(resultSession.createdAt).toBeTruthy();
        expect(resultSession.updatedAt).toBeTruthy();
      });
    });

    describe('findSessionByToken', () => {
      it('should return null for not found session', async () => {
        const resultSession = await database.findSessionByToken(token);
        expect(resultSession).toBeNull();
      });

      it('should find the session', async () => {
        const sessionId = await database.createSession(session.userId, token, connectionInfo);
        const resultSession = await database.findSessionByToken(token);
        expect(resultSession).toBeTruthy();
      });
    });

    describe('findSessionById', () => {
      it('should return null for not found session', async () => {
        const resultSession = await database.findSessionById(token);
        expect(resultSession).toBeNull();
      });

      it('should find the session', async () => {
        const sessionId = await database.createSession(session.userId, token, connectionInfo);
        const resultSession = await database.findSessionById(sessionId);
        expect(resultSession).toBeTruthy();
      });
    });

    describe('updateSession', () => {
      it('should not throw for not found session', async () => {
        await expect(database.updateSession(token, connectionInfo)).resolves.not.toThrow();
      });

      it('should update the session', async () => {
        const sessionId = await database.createSession(session.userId, token, connectionInfo);
        // Add a delay to see that createdAt is different that updatedAt
        await delay(10);
        await database.updateSession(sessionId, {
          ip: 'new ip',
          userAgent: 'new user agent',
        });
        const resultSession = await database.findSessionById(sessionId);
        expect(resultSession.userId).toEqual(session.userId);
        expect(resultSession.ip).toEqual('new ip');
        expect(resultSession.userAgent).toEqual('new user agent');
        expect(resultSession.createdAt).not.toEqual(resultSession.updatedAt);
      });
    });

    describe('invalidateSession', () => {
      it('should not throw for not found session', async () => {
        await expect(database.invalidateSession('invalid')).resolves.not.toThrow();
      });

      it('should invalidate the session', async () => {
        const sessionId = await database.createSession(session.userId, token, connectionInfo);
        // Add a delay to see that createdAt is different that updatedAt
        await delay(10);
        await database.invalidateSession(sessionId);
        const resultSession = await database.findSessionById(sessionId);
        expect(resultSession.valid).toEqual(false);
        expect(resultSession.createdAt).not.toEqual(resultSession.updatedAt);
      });
    });

    describe('invalidateAllSessions', () => {
      it('invalidates all sessions', async () => {
        const sessionId1 = await database.createSession(session.userId, token, connectionInfo);
        const sessionId2 = await database.createSession(session.userId, token2, connectionInfo);
        await delay(10);
        await database.invalidateAllSessions(session.userId);
        const session1 = await database.findSessionById(sessionId1);
        const session2 = await database.findSessionById(sessionId2);
        expect(session1.valid).toEqual(false);
        expect(session1.createdAt).not.toEqual(session1.updatedAt);
        expect(session2.valid).toEqual(false);
        expect(session2.createdAt).not.toEqual(session2.updatedAt);
      });
    });
  });
};

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
