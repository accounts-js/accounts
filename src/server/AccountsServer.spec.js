import jwtDecode from 'jwt-decode';
import Accounts from './AccountsServer';
import { hashPassword } from './encryption';


describe('Accounts', () => {
  beforeEach(() => {
    Accounts.config({}, {});
  });
  describe('config', () => {
    beforeEach(() => {
    });
    it('requires a db driver', () => {
      try {
        Accounts.config();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('A database driver is required');
      }
    });
    it('sets the db driver', () => {
      const db = {};
      Accounts.config({}, db);
      expect(Accounts.instance.db).toEqual(db);
    });
  });
  const db = {
    findUserByUsername: () => Promise.resolve(),
    findUserByEmail: () => Promise.resolve(),
    createUser: () => Promise.resolve(),
  };
  describe('createUser', () => {
    beforeEach(() => {
      Accounts.config({}, db);
    });
    it('requires username or an email', async () => {
      Accounts.config({}, db);
      try {
        await Accounts.createUser({
          password: '123456',
          username: '',
          email: '',
        });
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Username or Email is required');
      }
    });
    it('throws error if username exists', async () => {
      Accounts.config({}, {
        ...db,
        findUserByUsername: () => Promise.resolve('user'),
      });
      try {
        await Accounts.createUser({
          password: '123456',
          username: 'user1',
          email: '',
        });
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Username already exists');
      }
    });
    it('throws error if email exists', async () => {
      Accounts.config({}, {
        ...db,
        findUserByEmail: () => Promise.resolve('user'),
      });
      try {
        await Accounts.createUser({
          password: '123456',
          username: '',
          email: 'email1',
        });
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Email already exists');
      }
    });
    it('succesfully create a user', async () => {
      Accounts.config({}, {
        ...db,
        createUser: () => Promise.resolve('123'),
      });
      const userId = await Accounts.createUser({
        password: '123456',
        username: 'user1',
      });
      expect(userId).toEqual('123');
    });
  });
  describe('loginWithPassword - errors', () => {
    it('throws error if user is undefined', async () => {
      try {
        await Accounts.loginWithPassword(null, '123456');
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Unrecognized options for login request [400]');
      }
    });
    it('throws error if password is undefined', async () => {
      try {
        await Accounts.loginWithPassword('username', null);
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Unrecognized options for login request [400]');
      }
    });
    it('throws error if user is not a string or an object', async () => {
      try {
        await Accounts.loginWithPassword(1, '123456');
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Match failed [400]');
      }
    });
    it('throws error if password is not a string', async () => {
      try {
        await Accounts.loginWithPassword('username', {});
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Match failed [400]');
      }
    });
    it('throws error if user is not found', async () => {
      Accounts.config({}, {
        findUserByUsername: () => Promise.resolve(null),
        findUserByEmail: () => Promise.resolve(null),
      });
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('User not found [403]');
      }
    });
    it('throws error if password not set', async () => {
      Accounts.config({}, {
        findUserByUsername: () => Promise.resolve('123'),
        findUserByEmail: () => Promise.resolve(null),
        findPasswordHash: () => Promise.resolve(null),
      });
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('User has no password set [403]');
      }
    });
    it('throws error if password is incorrect', async () => {
      Accounts.config({}, {
        findUserByUsername: () => Promise.resolve('123'),
        findUserByEmail: () => Promise.resolve(null),
        findPasswordHash: () => Promise.resolve('hash'),
        verifyPassword: () => Promise.resolve(false),
      });
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Incorrect password [403]');
      }
    });
    describe('loginWithUser', () => {
      it('login using id', async () => {
        const hash = hashPassword('1234567');
        const findUserById = jest.fn(() => Promise.resolve({
          id: '123',
          username: 'username',
          email: 'email@email.com',
          profile: {
            bio: 'bio',
          },
        }));
        Accounts.config({}, {
          findUserById,
          findPasswordHash: () => Promise.resolve(hash),
          createSession: () => Promise.resolve('sessionId'),
        });
        const res = await Accounts.loginWithPassword({ id: '123' }, '1234567');
        expect(findUserById.mock.calls[0][0]).toEqual('123');
        expect(res.user).toEqual({
          id: '123',
          username: 'username',
          email: 'email@email.com',
          profile: {
            bio: 'bio',
          },
        });
        const { accessToken, refreshToken } = res.tokens;
        const decodedAccessToken = jwtDecode(accessToken);
        expect(decodedAccessToken.data.sessionId).toEqual('sessionId');
        expect(accessToken).toBeTruthy();
        expect(refreshToken).toBeTruthy();
      });
    });
    describe('resumeSession', () => {
      it('requires a session id', async () => {
        Accounts.config({}, {});
        try {
          await Accounts.resumeSession(null);
          throw new Error();
        } catch (err) {
          const { message } = err.serialize();
          expect(message).toEqual('Session ID is required');
        }
      });
      it('requires access token and refresh token', async () => {
        Accounts.config({}, {});
        try {
          await Accounts.resumeSession('session id');
          throw new Error();
        } catch (err) {
          const { message } = err.serialize();
          expect(message).toEqual('An accessToken and refreshToken are required');
        }
        try {
          await Accounts.resumeSession('session id', { accessToken: '' });
          throw new Error();
        } catch (err) {
          const { message } = err.serialize();
          expect(message).toEqual('An accessToken and refreshToken are required');
        }
        try {
          await Accounts.resumeSession('session id', { refreshToken: '' });
          throw new Error();
        } catch (err) {
          const { message } = err.serialize();
          expect(message).toEqual('An accessToken and refreshToken are required');
        }
      });
      it('throws error if session not found', async () => {
        Accounts.config({}, {
          findSessionById: () => Promise.resolve(null),
        });
        try {
          await Accounts.resumeSession('session id', { accessToken: '', refreshToken: '' });
          throw new Error();
        } catch (err) {
          const { message } = err.serialize();
          expect(message).toEqual('Session not found');
        }
      });
      it('throws error if user not found', async () => {
        Accounts.config({}, {
          findSessionById: () => Promise.resolve({
            isValid: true,
          }),
          findUserById: () => Promise.resolve(null),
        });
        try {
          await Accounts.resumeSession('session id', { accessToken: '', refreshToken: '' });
          throw new Error();
        } catch (err) {
          const { message } = err.serialize();
          expect(message).toEqual('User not found');
        }
      });
      it('throws error if session not valid', async () => {
        Accounts.config({}, {
          findSessionById: () => Promise.resolve({
            isValid: false,
          }),
        });
        try {
          await Accounts.resumeSession('session id', { accessToken: '', refreshToken: '' });
          throw new Error();
        } catch (err) {
          const { message } = err.serialize();
          expect(message).toEqual('Session is no longer valid');
        }
      });
    });
  });
});
