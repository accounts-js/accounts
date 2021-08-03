import { randomBytes } from 'crypto';

const generateRandomToken = (length = 43): string => randomBytes(length).toString('hex');
const generatePseudoRandomUuid = () =>
  [4, 2, 2, 2, 6].map((len) => generateRandomToken(len)).join('-');

function delay(time: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), time));
}

// eslint-disable-next-line jest/no-export
export const runDatabaseTests = (tests: any) => {
  describe('@accounts/database-tests', () => {
    const token1 = generateRandomToken();
    const token2 = generateRandomToken();
    const token3 = generateRandomToken();
    const token4 = generateRandomToken();
    const tokenSessionId1 = generatePseudoRandomUuid();

    const session = {
      userId: generatePseudoRandomUuid(),
      ip: '127.0.0.1',
      userAgent: 'user agent',
    };

    const connectionInfo = {
      ip: '127.0.0.1',
      userAgent: 'user agent',
    };

    beforeAll(tests.setup);
    afterAll(tests.teardown);
    beforeEach(tests.beforeEach);

    describe('sessions', () => {
      describe('createSession', () => {
        it('should create session', async () => {
          const sessionId = await tests.database.createSession(session.userId, token1, {
            ip: session.ip,
            userAgent: session.userAgent,
          });
          const resultSession = await tests.database.findSessionById(sessionId);
          expect(resultSession.id).toBeTruthy();
          expect(resultSession.userId).toEqual(session.userId);
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
          await tests.database.createSession(session.userId, token1, connectionInfo);
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
          const sessionId = await tests.database.createSession(
            session.userId,
            token1,
            connectionInfo
          );
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
          const sessionId = await tests.database.createSession(
            session.userId,
            token1,
            connectionInfo
          );
          // Add a delay to see that createdAt is different that updatedAt
          await delay(10);
          await tests.database.updateSession(sessionId, {
            ip: 'new ip',
            userAgent: 'new user agent',
          });
          const resultSession = await tests.database.findSessionById(sessionId);
          expect(resultSession.userId).toEqual(session.userId);
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
          const sessionId = await tests.database.createSession(
            session.userId,
            token1,
            connectionInfo
          );
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
          const sessionId1 = await tests.database.createSession(
            session.userId,
            token1,
            connectionInfo
          );
          const sessionId2 = await tests.database.createSession(
            session.userId,
            token2,
            connectionInfo
          );
          await delay(10);
          await tests.database.invalidateAllSessions(session.userId);
          const session1 = await tests.database.findSessionById(sessionId1);
          const session2 = await tests.database.findSessionById(sessionId2);
          expect(session1.valid).toEqual(false);
          expect(session1.createdAt).not.toEqual(session1.updatedAt);
          expect(session2.valid).toEqual(false);
          expect(session2.createdAt).not.toEqual(session2.updatedAt);
        });

        it('invalidates all sessions except given list', async () => {
          const sessionId1 = await tests.database.createSession(
            session.userId,
            token1,
            connectionInfo
          );
          const sessionId2 = await tests.database.createSession(
            session.userId,
            token2,
            connectionInfo
          );
          const sessionId3 = await tests.database.createSession(
            session.userId,
            token3,
            connectionInfo
          );
          const sessionId4 = await tests.database.createSession(
            session.userId,
            token4,
            connectionInfo
          );
          await delay(10);
          await tests.database.invalidateAllSessions(session.userId, [sessionId2, sessionId4]);

          const session1 = await tests.database.findSessionById(sessionId1);
          const session2 = await tests.database.findSessionById(sessionId2);
          const session3 = await tests.database.findSessionById(sessionId3);
          const session4 = await tests.database.findSessionById(sessionId4);

          expect(session1.valid).toEqual(false);
          expect(session1.createdAt).not.toEqual(session1.updatedAt);

          expect(session2.valid).toEqual(true);
          expect(session2.createdAt).toEqual(session2.updatedAt);

          expect(session3.valid).toEqual(false);
          expect(session3.createdAt).not.toEqual(session3.updatedAt);

          expect(session4.valid).toEqual(true);
          expect(session4.createdAt).toEqual(session4.updatedAt);
        });
      });
    });
  });
};
