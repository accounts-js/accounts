import { randomBytes } from 'crypto';
import { type Connection, createConnection } from 'typeorm';
import { AccountsTypeorm, entities } from '../src';

const generateRandomToken = (length = 43): string => randomBytes(length).toString('hex');

const user = {
  username: 'johndoe',
  email: 'john@doe.com',
  password: 'toto',
};

describe('TypeormSessions', () => {
  let userId: string;
  let session: Record<string, string>;

  let connection: Connection;
  const url = 'postgres://postgres@localhost:5432/accounts-js-tests-e2e';

  beforeAll(async () => {
    connection = await createConnection({
      type: 'postgres',
      url,
      entities,
    });
  });

  beforeEach(async () => {
    // Session needs a valid userId
    const accountsTypeorm = new AccountsTypeorm({}, connection);
    userId = await accountsTypeorm.createUser(user);
    session = { userId, ip: '127.0.0.1', userAgent: 'user agent' };
  });

  afterEach(async () => {
    await connection.query('delete from "user"');
    await connection.query('delete from "user_email"');
    await connection.query('delete from "user_service"');
    await connection.query('delete from "user_session"');
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('createSession', () => {
    it('should create session', async () => {
      const accountsTypeorm = new AccountsTypeorm({}, connection);
      const token = generateRandomToken();
      const sessionId = await accountsTypeorm.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await accountsTypeorm.findSessionById(sessionId);
      expect(ret).toBeTruthy();
      expect(ret!.id).toBeTruthy();
      expect(ret!.userId).toEqual(session.userId);
      expect(ret!.ip).toEqual(session.ip);
      expect(ret!.userAgent).toEqual(session.userAgent);
      expect(ret!.token).toEqual(token);
      expect(ret!.valid).toEqual(true);
      expect(ret!.createdAt).toBeTruthy();
      expect(ret!.createdAt).toEqual(new Date(ret!.createdAt));
      expect(ret!.updatedAt).toBeTruthy();
    });

    it('should create session with extra data', async () => {
      const accountsTypeorm = new AccountsTypeorm({}, connection);
      const impersonatorUserId = '789';
      const token = generateRandomToken();
      const sessionId = await accountsTypeorm.createSession(
        session.userId,
        token,
        { ip: session.ip, userAgent: session.userAgent },
        { impersonatorUserId }
      );
      const ret = await accountsTypeorm.findSessionById(sessionId);
      expect(ret).toBeTruthy();
      expect(ret!.id).toBeTruthy();
      expect(ret!.userId).toEqual(session.userId);
      expect(ret!.ip).toEqual(session.ip);
      expect(ret!.userAgent).toEqual(session.userAgent);
      expect(ret!.valid).toEqual(true);
      expect(ret!.token).toEqual(token);
      expect(ret!.createdAt).toEqual(new Date(ret!.createdAt));
      expect(ret!.updatedAt).toBeTruthy();
      expect((ret as any).extra).toEqual({ impersonatorUserId });
    });
  });

  describe('findSessionById', () => {
    it('should return null for not found session', async () => {
      const accountsTypeorm = new AccountsTypeorm({}, connection);
      const ret = await accountsTypeorm.findSessionById('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should find session', async () => {
      const accountsTypeorm = new AccountsTypeorm({}, connection);
      const sessionId = await accountsTypeorm.createSession(session.userId, 'token');
      const ret = await accountsTypeorm.findSessionById(sessionId);
      expect(ret).toBeTruthy();
    });
  });

  describe('findSessionByToken', () => {
    it('should return null for not found session', async () => {
      const accountsTypeorm = new AccountsTypeorm({}, connection);
      const ret = await accountsTypeorm.findSessionByToken('589871d1-c939-3d44-5745-a57c1111');
      expect(ret).not.toBeTruthy();
    });

    it('should find session', async () => {
      const accountsTypeorm = new AccountsTypeorm({}, connection);
      const token = generateRandomToken();
      await accountsTypeorm.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await accountsTypeorm.findSessionByToken(token);
      expect(ret).toBeTruthy();
    });
  });

  describe('updateSession', () => {
    it('should update session', async () => {
      const accountsTypeorm = new AccountsTypeorm({}, connection);
      const token = generateRandomToken();
      const sessionId = await accountsTypeorm.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await accountsTypeorm.updateSession(sessionId, {
        ip: 'new ip',
        userAgent: 'new user agent',
      });
      const ret = await accountsTypeorm.findSessionById(sessionId);
      expect(ret!.userId).toEqual(session.userId);
      expect(ret!.ip).toEqual('new ip');
      expect(ret!.userAgent).toEqual('new user agent');
      expect(ret!.valid).toEqual(true);
      expect(ret!.token).toEqual(token);
      expect(ret!.createdAt).toBeTruthy();
      expect(ret!.updatedAt).toBeTruthy();
      expect(ret!.createdAt).not.toEqual(ret!.updatedAt);
    });

    // TODO: updateSession does not accept a token like mongodb
    // it('should update session with token', async () => {
    //   const accountsTypeorm = new AccountsTypeorm({}, connection);
    //   const token = generateRandomToken();
    //   const token2 = generateRandomToken();
    //   const sessionId = await accountsTypeorm.createSession(session.userId, token, {
    //     ip: session.ip,
    //     userAgent: session.userAgent,
    //   });
    //   await accountsTypeorm.updateSession(
    //     sessionId,
    //     {
    //       ip: 'new ip',
    //       userAgent: 'new user agent',
    //     },
    //     token2
    //   );
    //   const ret = await accountsTypeorm.findSessionById(sessionId);
    //   expect(ret!.userId).toEqual(session.userId);
    //   expect(ret!.ip).toEqual('new ip');
    //   expect(ret!.userAgent).toEqual('new user agent');
    //   expect(ret!.valid).toEqual(true);
    //   expect(ret!.token).toEqual(token2);
    //   expect(ret!.createdAt).toBeTruthy();
    //   expect(ret!.updatedAt).toBeTruthy();
    //   expect(ret!.createdAt).not.toEqual(ret!.updatedAt);
    // });
  });

  describe('invalidateSession', () => {
    it('invalidates a session', async () => {
      const accountsTypeorm = new AccountsTypeorm({}, connection);
      const token = generateRandomToken();
      const sessionId = await accountsTypeorm.createSession(session.userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await accountsTypeorm.invalidateSession(sessionId);
      const ret = await accountsTypeorm.findSessionById(sessionId);
      expect(ret!.valid).toEqual(false);
      expect(ret!.createdAt).not.toEqual(ret!.updatedAt);
    });
  });

  describe('invalidateAllSessions', () => {
    it('invalidates all sessions', async () => {
      const accountsTypeorm = new AccountsTypeorm({}, connection);
      const sessionId1 = await accountsTypeorm.createSession(
        session.userId,
        generateRandomToken(),
        {
          ip: session.ip,
          userAgent: session.userAgent,
        }
      );
      const sessionId2 = await accountsTypeorm.createSession(
        session.userId,
        generateRandomToken(),
        {
          ip: session.ip,
          userAgent: session.userAgent,
        }
      );
      await accountsTypeorm.invalidateAllSessions(session.userId);
      const session1 = await accountsTypeorm.findSessionById(sessionId1);
      const session2 = await accountsTypeorm.findSessionById(sessionId2);
      expect(session1!.valid).toEqual(false);
      expect(session1!.createdAt).not.toEqual(session1!.updatedAt);
      expect(session2!.valid).toEqual(false);
      expect(session2!.createdAt).not.toEqual(session2!.updatedAt);
    });

    it('invalidates all sessions except given list', async () => {
      const accountsTypeorm = new AccountsTypeorm({}, connection);
      const sessionId1 = await accountsTypeorm.createSession(
        session.userId,
        generateRandomToken(),
        {
          ip: session.ip,
          userAgent: session.userAgent,
        }
      );
      const sessionId2 = await accountsTypeorm.createSession(
        session.userId,
        generateRandomToken(),
        {
          ip: session.ip,
          userAgent: session.userAgent,
        }
      );
      const sessionId3 = await accountsTypeorm.createSession(
        session.userId,
        generateRandomToken(),
        {
          ip: session.ip,
          userAgent: session.userAgent,
        }
      );
      const sessionId4 = await accountsTypeorm.createSession(
        session.userId,
        generateRandomToken(),
        {
          ip: session.ip,
          userAgent: session.userAgent,
        }
      );
      await accountsTypeorm.invalidateAllSessions(session.userId, [sessionId2, sessionId4]);

      const session1 = await accountsTypeorm.findSessionById(sessionId1);
      const session2 = await accountsTypeorm.findSessionById(sessionId2);
      const session3 = await accountsTypeorm.findSessionById(sessionId3);
      const session4 = await accountsTypeorm.findSessionById(sessionId4);

      expect(session1!.valid).toEqual(false);
      expect(session2!.valid).toEqual(true);
      expect(session3!.valid).toEqual(false);
      expect(session4!.valid).toEqual(true);
    });
  });
});
