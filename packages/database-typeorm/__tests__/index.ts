import 'reflect-metadata';
import { randomBytes } from 'crypto';
import { DatabaseTests } from './database-tests';
import { AccountsTypeorm } from '../src/typeorm';
import { MfaLoginAttempt } from '../src/entity/MfaLoginAttempt';
const databaseTests = new DatabaseTests();

const generateRandomToken = (length: number = 43): string => randomBytes(length).toString('hex');
const generatePseudoRandomUuid = () =>
  [4, 2, 2, 2, 6].map(len => generateRandomToken(len)).join('-');

const user = {
  username: 'foo',
  email: 'foo@bar.baz',
  password: 'foobarbaz',
};

const session = {
  ip: '127.0.0.1',
  userAgent: 'user agent',
};

function delay(time: number) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}

describe('AccountsTypeorm', () => {
  beforeAll(databaseTests.setup);
  afterAll(databaseTests.teardown);
  beforeEach(databaseTests.beforeEach);

  describe('#constructor', () => {
    it('should have default options', () => {
      expect((databaseTests as any).database.options).toBeTruthy();
    });

    it('should need a working connection', () => {
      try {
        new AccountsTypeorm({ connectionName: 'not-exists' }); // tslint:disable-line no-unused-expression
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Connection "not-exists" was not found.');
      }
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userId = await databaseTests.database.createUser(user);
      const ret = await databaseTests.database.findUserById(userId);
      expect(userId).toBeTruthy();
      expect(ret).not.toBeNull();
      expect(ret!.username).toBe(user.username);
      expect(ret!.emails[0]).toMatchSnapshot({
        id: expect.any(String),
        address: user.email,
        verified: false,
        userId: expect.any(String),
      });
      expect(ret!.services).toMatchSnapshot({
        password: [
          {
            bcrypt: user.password,
          },
        ],
      });
      expect(ret!.deactivated).toBe(false);
      expect(ret!.sessions).toHaveLength(0);
    });

    it('should not overwrite service', async () => {
      const userId = await databaseTests.database.createUser({
        ...user,
        services: 'test',
      });
      const ret = await databaseTests.database.findUserById(userId);
      expect(userId).toBeTruthy();
      expect(ret!.services).toEqual({
        password: [
          {
            bcrypt: user.password,
          },
        ],
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
      expect(ret!.emails).toHaveLength(0);
    });

    it('email should be lowercase', async () => {
      const userId = await databaseTests.database.createUser({ email: 'JohN@doe.com' });
      const ret = await databaseTests.database.findUserById(userId);
      expect(ret!.id).toBeTruthy();
      expect(ret!.emails![0].address).toEqual('john@doe.com');
    });
  });

  describe('findUserById', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserById(generatePseudoRandomUuid());
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const userId = await databaseTests.database.createUser(user);
      const ret = await databaseTests.database.findUserById(userId);
      expect(ret).toBeTruthy();
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
      expect(ret!.id).toBeTruthy();
    });

    it('should return user with uppercase email', async () => {
      await databaseTests.database.createUser({ email: 'JOHN@DOES.COM' });
      const ret = await databaseTests.database.findUserByEmail('JOHN@DOES.COM');
      expect(ret!.id).toBeTruthy();
      expect(ret!.emails![0].address).toEqual('john@does.com');
    });
  });

  describe('findUserByUsername', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserByUsername('unknowuser');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      await databaseTests.database.createUser(user);
      const ret = await databaseTests.database.findUserByUsername(user.username);
      expect(ret).toBeTruthy();
      expect(ret!.id).toBeTruthy();
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
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('findUserByResetPasswordToken', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserByResetPasswordToken('token');
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addResetPasswordToken(userId, 'john@doe.com', 'token', 'test');
      const ret = await databaseTests.database.findUserByResetPasswordToken('token');
      expect(ret).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('findUserByServiceId', () => {
    it('should return null for not found user', async () => {
      const ret = await databaseTests.database.findUserByServiceId(
        'facebook',
        generatePseudoRandomUuid()
      );
      expect(ret).not.toBeTruthy();
    });

    it('should return user', async () => {
      const serviceId = generatePseudoRandomUuid();
      const userId = await databaseTests.database.createUser(user);
      let ret = await databaseTests.database.findUserByServiceId('facebook', serviceId);
      expect(ret).not.toBeTruthy();
      await databaseTests.database.setService(userId, 'facebook', { id: '1' });
      ret = await databaseTests.database.findUserByServiceId('facebook', '1');
      expect(ret).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('findPasswordHash', () => {
    it('should return null on not found user', async () => {
      const ret = await databaseTests.database.findPasswordHash(generatePseudoRandomUuid());
      expect(ret).toEqual(null);
    });

    it('should return hash', async () => {
      const userId = await databaseTests.database.createUser(user);
      const retUser = await databaseTests.database.findUserById(userId);
      const ret = await databaseTests.database.findPasswordHash(userId);
      const services: any = retUser!.services;
      expect(ret).toBeTruthy();
      expect(ret).toEqual(services.password[0].bcrypt);
    });
  });

  describe('addEmail', () => {
    it('should throw if user is not found', async () => {
      try {
        await databaseTests.database.addEmail(generatePseudoRandomUuid(), 'unknowemail', false);
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
      expect(retUser!.emails!.length).toEqual(2);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });

    it('should add lowercase email', async () => {
      const email = 'johnS@doe.com';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmail(userId, email, false);
      const retUser = await databaseTests.database.findUserByEmail(email);
      expect(retUser!.emails!.length).toEqual(2);
      expect(retUser!.emails![1].address).toEqual('johns@doe.com');
    });
  });

  describe('removeEmail', () => {
    it('should throw if user is not found', async () => {
      try {
        await databaseTests.database.removeEmail(generatePseudoRandomUuid(), 'unknowemail');
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
      await databaseTests.database.removeEmail(userId, user.email);
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.emails!.length).toEqual(1);
      expect(retUser!.emails![0].address).toEqual(email);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });

    it('should remove uppercase email', async () => {
      const email = 'johns@doe.com';
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmail(userId, email, false);
      await databaseTests.database.removeEmail(userId, 'FOO@bar.baz');
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.emails!.length).toEqual(1);
      expect(retUser!.emails![0].address).toEqual(email);
    });
  });

  describe('verifyEmail', () => {
    it('should throw if user is not found', async () => {
      try {
        await databaseTests.database.verifyEmail(generatePseudoRandomUuid(), 'unknowemail');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('should verify email', async () => {
      const userId = await databaseTests.database.createUser(user);
      await delay(10);
      let retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.emails!.length).toEqual(1);
      expect(retUser!.emails![0].address).toBe(user.email);
      expect(retUser!.emails![0].verified).toBe(false);
      await databaseTests.database.verifyEmail(userId, user.email);
      retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.emails!.length).toEqual(1);
      expect(retUser!.emails![0].address).toBe(user.email);
      expect(retUser!.emails![0].verified).toBe(true);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });
  });

  describe('setUsername', () => {
    it('should throw if user is not found', async () => {
      try {
        await databaseTests.database.setUsername(generatePseudoRandomUuid(), 'username');
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
      expect(retUser!.username).toEqual(username);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });
  });

  describe('setPassword', () => {
    it('should throw if user is not found', async () => {
      try {
        await databaseTests.database.setPassword(generatePseudoRandomUuid(), 'toto');
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
      const services: any = retUser!.services;
      expect(services.password[0].bcrypt).toBeTruthy();
      expect(services.password[0].bcrypt).toEqual(newPassword);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });
  });

  describe('setService', () => {
    it('should set service', async () => {
      const userId = await databaseTests.database.createUser(user);
      let ret = await databaseTests.database.findUserByServiceId('google', '1');
      expect(ret).not.toBeTruthy();
      await databaseTests.database.setService(userId, 'google', { id: '1' });
      ret = await databaseTests.database.findUserByServiceId('google', '1');
      expect(ret).toBeTruthy();
      expect(ret!.id).toBeTruthy();
    });
  });

  describe('unsetService', () => {
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
      const userId = await databaseTests.database.createUser(user);
      const sessionId = await databaseTests.database.createSession(userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await databaseTests.database.findSessionById(sessionId!);
      expect(ret).toBeTruthy();
      expect(ret!.userId).toEqual(userId);
      expect(ret!.ip).toEqual(session.ip);
      expect(ret!.userAgent).toEqual(session.userAgent);
      expect(ret!.token).toEqual(token);
      expect(ret!.valid).toEqual(true);
      expect(ret!.createdAt).toBeTruthy();
      expect(ret!.updatedAt).toBeTruthy();
    });

    it('should create session with extra data', async () => {
      const impersonatorUserId = '789';
      const token = generateRandomToken();
      const userId = await databaseTests.database.createUser(user);
      const sessionId = await databaseTests.database.createSession(
        userId,
        token,
        { ip: session.ip, userAgent: session.userAgent },
        { impersonatorUserId }
      );
      const ret = await databaseTests.database.findSessionById(sessionId!);
      expect(ret).toBeTruthy();
      expect(ret!.userId).toEqual(userId);
      expect(ret!.ip).toEqual(session.ip);
      expect(ret!.userAgent).toEqual(session.userAgent);
      expect(ret!.valid).toEqual(true);
      expect(ret!.token).toEqual(token);
      expect(ret!.updatedAt).toBeTruthy();
      expect((ret as any).extra).toEqual({ impersonatorUserId });
    });
  });

  describe('findSessionByToken', () => {
    it('should return null for not found session', async () => {
      const ret = await databaseTests.database.findSessionByToken('589871d1c9393d445745a57c');
      expect(ret).not.toBeTruthy();
    });

    it('should find session', async () => {
      const token = generateRandomToken();
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.createSession(userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const ret = await databaseTests.database.findSessionByToken(token);
      expect(ret).toBeTruthy();
    });
  });

  describe('findSessionById', () => {
    it('should return null for not found session', async () => {
      const ret = await databaseTests.database.findSessionById(generatePseudoRandomUuid());
      expect(ret).not.toBeTruthy();
    });

    it('should find session', async () => {
      const userId = await databaseTests.database.createUser(user);
      const sessionId = await databaseTests.database.createSession(userId, 'token');
      const ret = await databaseTests.database.findSessionById(sessionId!);
      expect(ret).toBeTruthy();
    });
  });

  describe('updateSession', () => {
    it('should update session', async () => {
      const token = generateRandomToken();
      const userId = await databaseTests.database.createUser(user);
      const sessionId = await databaseTests.database.createSession(userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await delay(10);
      await databaseTests.database.updateSession(sessionId!, {
        ip: 'new ip',
        userAgent: 'new user agent',
      });
      const ret = await databaseTests.database.findSessionById(sessionId!);
      expect(ret!.userId).toEqual(userId);
      expect(ret!.ip).toEqual('new ip');
      expect(ret!.userAgent).toEqual('new user agent');
      expect(ret!.valid).toEqual(true);
      expect(ret!.token).toEqual(token);
      expect(ret!.createdAt).toBeTruthy();
      expect(ret!.updatedAt).toBeTruthy();
      expect(ret!.createdAt).not.toEqual(ret!.updatedAt);
    });
  });

  describe('invalidateSession', () => {
    it('invalidates a session', async () => {
      const token = generateRandomToken();
      const userId = await databaseTests.database.createUser(user);
      const sessionId = await databaseTests.database.createSession(userId, token, {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await delay(10);
      await databaseTests.database.invalidateSession(sessionId!);
      const ret = await databaseTests.database.findSessionById(sessionId!);
      expect(ret!.valid).toEqual(false);
      expect(ret!.createdAt).not.toEqual(ret!.updatedAt);
    });
  });

  describe('invalidateAllSessions', () => {
    it('invalidates all sessions', async () => {
      const userId = await databaseTests.database.createUser(user);
      const sessionId1 = await databaseTests.database.createSession(userId, generateRandomToken(), {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      const sessionId2 = await databaseTests.database.createSession(userId, generateRandomToken(), {
        ip: session.ip,
        userAgent: session.userAgent,
      });
      await delay(10);
      await databaseTests.database.invalidateAllSessions(userId);
      const session1 = await databaseTests.database.findSessionById(sessionId1!);
      const session2 = await databaseTests.database.findSessionById(sessionId2!);
      expect(session1!.valid).toEqual(false);
      expect(session1!.createdAt).not.toEqual(session1!.updatedAt);
      expect(session2!.valid).toEqual(false);
      expect(session2!.createdAt).not.toEqual(session2!.updatedAt);
    });
  });

  describe('addEmailVerificationToken', () => {
    it('should add a token', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addEmailVerificationToken(userId, 'john@doe.com', 'token');
      const retUser = await databaseTests.database.findUserById(userId);
      const services: any = retUser!.services;
      expect(services.email.verificationTokens.length).toEqual(1);
      expect(services.email.verificationTokens[0].address).toEqual('john@doe.com');
      expect(services.email.verificationTokens[0].token).toEqual('token');
      expect(services.email.verificationTokens[0].when).toBeTruthy();
    });
  });

  describe('addResetPasswordToken', () => {
    it('should add a token', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.addResetPasswordToken(userId, 'john@doe.com', 'token', 'reset');
      const retUser = await databaseTests.database.findUserById(userId);
      const services: any = retUser!.services;
      expect(services.password.reset.length).toEqual(1);
      expect(services.password.reset[0].address).toEqual('john@doe.com');
      expect(services.password.reset[0].token).toEqual('token');
      expect(services.password.reset[0].when).toBeTruthy();
      expect(services.password.reset[0].reason).toEqual('reset');
    });
  });

  describe('setResetPassword', () => {
    it('should change password', async () => {
      const newPassword = 'newpass';
      const userId = await databaseTests.database.createUser(user);
      await delay(10);
      await databaseTests.database.setResetPassword(userId, 'toto', newPassword);
      const retUser = await databaseTests.database.findUserById(userId);
      const services: any = retUser!.services;
      expect(services.password[0].bcrypt).toBeTruthy();
      expect(services.password[0].bcrypt).toEqual(newPassword);
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });
  });

  describe('setUserDeactivated', () => {
    it('should deactivate user', async () => {
      const userId = await databaseTests.database.createUser(user);
      await databaseTests.database.setUserDeactivated(userId, true);
      const retUser = await databaseTests.database.findUserById(userId);
      expect(retUser!.deactivated).toBeTruthy();
      expect((retUser as any).createdAt).not.toEqual((retUser as any).updatedAt);
    });
  });

  describe('createMfaLoginAttempt', () => {
    it('should create mfa login attempt', async () => {
      const mfaToken = generateRandomToken();
      const loginToken = generateRandomToken();
      const userId = '123';

      await databaseTests.database.createMfaLoginAttempt(mfaToken, loginToken, userId);

      const resFromDb = await databaseTests
        .connection!.getRepository(MfaLoginAttempt)
        .findOne(mfaToken);

      expect(resFromDb).toEqual({
        id: mfaToken,
        mfaToken,
        loginToken,
        userId,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('removeMfaLoginAttempt', () => {
    it('should remove mfa login attempt', async () => {
      const entity: any = {
        mfaToken: generateRandomToken(),
        loginToken: generateRandomToken(),
        userId: '123',
      };

      entity.id = entity.mfaToken;

      await databaseTests.connection!.getRepository(MfaLoginAttempt).save(entity);

      await databaseTests.database.removeMfaLoginAttempt(entity.mfaToken);

      const resFromDb = await databaseTests
        .connection!.getRepository(MfaLoginAttempt)
        .findOne(entity.mfaToken);

      expect(resFromDb).toBeUndefined();
    });
  });

  describe('getMfaLoginAttempt', () => {
    it('should return mfa login attempt', async () => {
      const entity: any = {
        mfaToken: generateRandomToken(),
        loginToken: generateRandomToken(),
        userId: '123',
      };

      entity.id = entity.mfaToken;

      await databaseTests.connection!.getRepository(MfaLoginAttempt).save(entity);

      const attempt = await databaseTests.database.getMfaLoginAttempt(entity.mfaToken);

      expect(attempt).toEqual(entity);
    });
  });
});
