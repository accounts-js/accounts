import { randomBytes } from 'crypto';

const generateRandomToken = (length: number = 43): string => randomBytes(length).toString('hex');
const generatePseudoRandomUuid = () =>
  [4, 2, 2, 2, 6].map(len => generateRandomToken(len)).join('-');

function delay(time: number) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}

export const runDatabaseTests = (tests: any) => {
  describe('@accounts/database-tests', () => {
    const token1 = generateRandomToken();
    const token2 = generateRandomToken();
    const tokenSessionId1 = generatePseudoRandomUuid();

    const session = {
      ip: '127.0.0.1',
      userAgent: 'user agent',
    };

    const connectionInfo = {
      ip: '127.0.0.1',
      userAgent: 'user agent',
    };

    const userSample = {
      username: 'foo',
      email: 'foo@bar.baz',
      password: 'foobar',
    };

    beforeAll(tests.setup);
    afterAll(tests.teardown);
    beforeEach(tests.beforeEach);

    describe('sessions', () => {
      describe('createSession', () => {
        it('should create session', async () => {
          const userId = await tests.database.createUser(userSample);
          const sessionId = await tests.database.createSession(userId, token1, {
            ip: session.ip,
            userAgent: session.userAgent,
          });
          const resultSession = await tests.database.findSessionById(sessionId);
          expect(resultSession.id).toBeTruthy();
          expect(resultSession.userId).toEqual(userId);
          expect(resultSession.ip).toEqual(session.ip);
          expect(resultSession.userAgent).toEqual(session.userAgent);
          expect(resultSession.token).toEqual(token1);
          expect(resultSession.valid).toEqual(true);
          expect(resultSession.createdAt).toBeTruthy();
          expect(resultSession.updatedAt).toBeTruthy();
        });
      });

      describe('findSessionByToken', () => {
        it('should return null for not found session', async () => {
          const resultSession = await tests.database.findSessionByToken(token1);
          expect(resultSession).toBeNull();
        });

        it('should find the session', async () => {
          const userId = await tests.database.createUser(userSample);
          await tests.database.createSession(userId, token1, connectionInfo);
          const resultSession = await tests.database.findSessionByToken(token1);
          expect(resultSession).toBeTruthy();
        });
      });

      describe('findSessionById', () => {
        it('should return null for not found session', async () => {
          const resultSession = await tests.database.findSessionById(tokenSessionId1);
          expect(resultSession).toBeNull();
        });

        it('should find the session', async () => {
          const userId = await tests.database.createUser(userSample);
          const sessionId = await tests.database.createSession(userId, token1, connectionInfo);
          const resultSession = await tests.database.findSessionById(sessionId);
          expect(resultSession).toBeTruthy();
        });
      });

      describe('updateSession', () => {
        it('should not throw for not found session', async () => {
          await expect(
            tests.database.updateSession(tokenSessionId1, connectionInfo)
          ).resolves.not.toThrow();
        });

        it('should update the session', async () => {
          const userId = await tests.database.createUser(userSample);
          const sessionId = await tests.database.createSession(userId, token1, connectionInfo);
          // Add a delay to see that createdAt is different that updatedAt
          await delay(10);
          await tests.database.updateSession(sessionId, {
            ip: 'new ip',
            userAgent: 'new user agent',
          });
          const resultSession = await tests.database.findSessionById(sessionId);
          expect(resultSession.userId).toEqual(userId);
          expect(resultSession.ip).toEqual('new ip');
          expect(resultSession.userAgent).toEqual('new user agent');
          expect(resultSession.createdAt).not.toEqual(resultSession.updatedAt);
        });
      });

      describe('invalidateSession', () => {
        it('should not throw for not found session', async () => {
          await expect(tests.database.invalidateSession('invalid')).resolves.not.toThrow();
        });

        it('should invalidate the session', async () => {
          const userId = await tests.database.createUser(userSample);
          const sessionId = await tests.database.createSession(userId, token1, connectionInfo);
          // Add a delay to see that createdAt is different that updatedAt
          await delay(10);
          await tests.database.invalidateSession(sessionId);
          const resultSession = await tests.database.findSessionById(sessionId);
          expect(resultSession.valid).toEqual(false);
          expect(resultSession.createdAt).not.toEqual(resultSession.updatedAt);
        });
      });

      describe('invalidateAllSessions', () => {
        it('invalidates all sessions', async () => {
          const userId = await tests.database.createUser(userSample);
          const sessionId1 = await tests.database.createSession(userId, token1, connectionInfo);
          const sessionId2 = await tests.database.createSession(userId, token2, connectionInfo);
          await delay(10);
          await tests.database.invalidateAllSessions(userId);
          const session1 = await tests.database.findSessionById(sessionId1);
          const session2 = await tests.database.findSessionById(sessionId2);
          expect(session1).toBeNull();
          expect(session2).toBeNull();
        });
      });
    });
  });
};
