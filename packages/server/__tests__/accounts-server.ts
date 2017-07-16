import * as jwtDecode from 'jwt-decode';
import { AccountsServer } from '../src/accounts-server';
import {
  bcryptPassword,
  hashPassword,
  verifyPassword,
} from '../src/encryption';

let Accounts;

describe('Accounts', () => {
  const db = {
    findUserByUsername: () => Promise.resolve(),
    findUserByEmail: () => Promise.resolve(),
    createUser: () => Promise.resolve(),
    createSession: () => Promise.resolve(),
  };

  beforeEach(() => {
    Accounts = new AccountsServer();
    Accounts.config({}, {});
  });

  describe('hooks', () => {
    it('onLoginSuccess', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onLoginSuccess(hookSpy);

      Accounts.config(
        {
          passwordAuthenticator: () => ({}),
        },
        {
          createSession: () => '123',
        }
      );

      await Accounts.loginWithPassword('username', '123456');
      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onLoginError with custom authenticator', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onLoginError(hookSpy);

      Accounts.config(
        {
          passwordAuthenticator: () => Promise.reject('error'),
        },
        {
          createSession: () => '123',
        }
      );

      try {
        await Accounts.loginWithPassword('username', '123456');
      } catch (e) {
        // nothing to do
      }
      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onLoginError with default authenticator', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onLoginError(hookSpy);

      Accounts.config(
        {},
        {
          findUserByUsername: () => Promise.resolve('123'),
          findUserByEmail: () => Promise.resolve(null),
          findPasswordHash: () => Promise.resolve('hash'),
          verifyPassword: () => Promise.resolve(false),
        }
      );

      try {
        await Accounts.loginWithPassword('username', '123456');
      } catch (e) {
        // Nothing to do
      }
      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onCreateUserSuccess', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onCreateUserSuccess(hookSpy);

      Accounts.config(
        {},
        {
          ...db,
          createUser: () => Promise.resolve('123'),
        }
      );

      await Accounts.createUser({
        password: '123456',
        username: 'user1',
      });

      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onCreateUserError', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onCreateUserError(hookSpy);

      Accounts.config(
        {},
        {
          createUser: () => Promise.reject('err'),
        }
      );

      try {
        await Accounts.createUser({
          password: '123456',
          username: 'user1',
        });
      } catch (e) {
        // nothing to do
      }

      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onLogoutSuccess', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onLogoutSuccess(hookSpy);

      const invalidateSession = jest.fn(() => Promise.resolve());
      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
          invalidateSession,
        }
      );

      const { accessToken } = Accounts.createTokens('456');
      await Accounts.logout(accessToken);
      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onLogoutError', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onLogoutError(hookSpy);

      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(null),
        }
      );

      try {
        const { accessToken } = Accounts.createTokens('456');
        await Accounts.logout(accessToken);
      } catch (err) {
        // nothing to do
      }

      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onResumeSessionSuccess', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onResumeSessionSuccess(hookSpy);

      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        { resumeSessionValidator: () => Promise.resolve(user) },
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
        }
      );

      const { accessToken } = Accounts.createTokens('456');
      await Accounts.resumeSession(accessToken);

      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onResumeSessionError with invalid session', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onResumeSessionError(hookSpy);

      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        { resumeSessionValidator: () => Promise.resolve(user) },
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: false,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
        }
      );

      const { accessToken } = Accounts.createTokens('456');

      try {
        await Accounts.resumeSession(accessToken);
      } catch (e) {
        // nothing to do
      }

      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onResumeSessionError with invalid errored session', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onResumeSessionError(hookSpy);

      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        { resumeSessionValidator: () => Promise.resolve(user) },
        {
          findSessionById: () => Promise.reject(''),
          findUserById: () => Promise.resolve(user),
        }
      );

      const { accessToken } = Accounts.createTokens('456');

      try {
        await Accounts.resumeSession(accessToken);
      } catch (e) {
        // nothing to do
      }

      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onRefreshTokenError', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onRefreshTokensError(hookSpy);

      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              valid: false,
            }),
        }
      );
      try {
        const { accessToken, refreshToken } = Accounts.createTokens();
        await Accounts.refreshTokens(accessToken, refreshToken);
      } catch (err) {
        // nothing to do
      }

      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onRefreshTokenSuccess', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onRefreshTokensSuccess(hookSpy);

      const updateSession = () => Promise.resolve();
      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
          updateSession,
        }
      );
      const { accessToken, refreshToken } = Accounts.createTokens('456');
      Accounts.createTokens = () => ({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });

      await Accounts.refreshTokens(
        accessToken,
        refreshToken,
        'ip',
        'user agent'
      );

      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onImpersonationError', async () => {
      const hookSpy = jest.fn(() => null);
      Accounts.onImpersonationError(hookSpy);

      Accounts.config({}, db);
      try {
        await Accounts.impersonate();
      } catch (err) {
        // nothing to do
      }

      expect(hookSpy.mock.calls.length).toBe(1);
    });

    it('onImpersonationSuccess', async () => {
      const user = { username: 'myUser', id: 123 };
      const impersonatedUser = { username: 'impUser', id: 456 };
      const { accessToken } = Accounts.createTokens('555');
      const hookSpy = jest.fn(() => null);
      Accounts.onImpersonationSuccess(hookSpy);

      Accounts.config(
        {
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return (
              userObject.id === user.id &&
              impersonateToUser === impersonatedUser
            );
          },
        },
        {
          findUserById: () => Promise.resolve(user),
          findUserByUsername: () => Promise.resolve(impersonatedUser),
          createSession: () => Promise.resolve('001'),
        }
      );

      Accounts.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        });
      Accounts.createTokens = (sessionId, isImpersonated) => ({
        sessionId,
        isImpersonated,
      });

      await Accounts.impersonate(accessToken, 'impUser');

      expect(hookSpy.mock.calls.length).toBe(1);
    });
  });

  describe('config', () => {
    it('requires a db driver', () => {
      try {
        Accounts.config();
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('A database driver is required');
      }
    });

    it('sets the db driver', () => {
      const testDB = {};
      Accounts.config({}, testDB);
      expect(Accounts.db).toEqual(testDB);
    });

    it('set custom password authenticator', () => {
      const testDB = {};
      Accounts.config({ passwordAuthenticator: () => null }, testDB);
      expect(Accounts._options.passwordAuthenticator).toBeDefined();
    });

    it('set custom userObjectSanitizer', () => {
      const testDB = {};
      const func = () => null;
      Accounts.config({ userObjectSanitizer: func }, testDB);
      expect(Accounts._options.userObjectSanitizer).toBe(func);
    });

    it('use default password authenticator', () => {
      const testDB = {};
      Accounts.config({}, testDB);
      expect(Accounts._options.passwordAuthenticator).toBeUndefined();
    });

    it('override allowedLoginFields values', () => {
      const testDB = {};
      Accounts.config({ allowedLoginFields: ['id'] }, testDB);
      expect(Accounts._options.allowedLoginFields).toEqual(['id']);
    });

    it('default allowedLoginFields values', () => {
      const testDB = {};
      Accounts.config({}, testDB);
      expect(Accounts._options.allowedLoginFields).toEqual([
        'id',
        'email',
        'username',
      ]);
    });
  });

  describe('options', () => {
    it('should return options', () => {
      Accounts.config({ config: 'config' }, {});
      const options = Accounts.options();
      expect(options.config).toEqual('config');
    });
  });

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
        const { message } = err;
        expect(message).toEqual('Username or Email is required');
      }
    });
    it('throws error if username exists', async () => {
      Accounts.config(
        {},
        {
          ...db,
          findUserByUsername: () => Promise.resolve('user'),
        }
      );
      try {
        await Accounts.createUser({
          password: '123456',
          username: 'user1',
          email: '',
        });
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Username already exists');
      }
    });
    it('throws error if email exists', async () => {
      Accounts.config(
        {},
        {
          ...db,
          findUserByEmail: () => Promise.resolve('user'),
        }
      );
      try {
        await Accounts.createUser({
          password: '123456',
          username: '',
          email: 'email1@email.com',
        });
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Email already exists');
      }
    });
    it('succesfully create a user', async () => {
      Accounts.config(
        {},
        {
          ...db,
          createUser: () => Promise.resolve('123'),
        }
      );
      const userId = await Accounts.createUser({
        password: '123456',
        username: 'user1',
      });
      expect(userId).toEqual('123');
    });
    it('throws error if validateNewUser does not pass', async () => {
      Accounts.config(
        {
          validateNewUser: () => Promise.reject('User did not pass validation'),
        },
        {
          ...db,
          createUser: () => Promise.resolve('123'),
        }
      );
      try {
        await Accounts.createUser({
          password: '123456',
          username: 'user1',
        });
        throw Error();
      } catch (err) {
        expect(err).toEqual('User did not pass validation');
      }
    });
  });

  describe('loginWithPassword - errors', () => {
    it('throws error if user is undefined', async () => {
      try {
        await Accounts.loginWithPassword(null, '123456');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for login request');
      }
    });

    it('throws error if password is undefined', async () => {
      try {
        await Accounts.loginWithPassword('username', null);
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for login request');
      }
    });

    it('throws error if user is not a string or an object', async () => {
      try {
        await Accounts.loginWithPassword(1, '123456');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Match failed');
      }
    });

    it('throws error if password is not a string', async () => {
      try {
        await Accounts.loginWithPassword('username', {});
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Match failed');
      }
    });

    it('throws error if user is not found', async () => {
      Accounts.config(
        {},
        {
          findUserByUsername: () => Promise.resolve(null),
          findUserByEmail: () => Promise.resolve(null),
        }
      );
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('User not found');
      }
    });

    it('throws error if password not set', async () => {
      Accounts.config(
        {},
        {
          findUserByUsername: () => Promise.resolve('123'),
          findUserByEmail: () => Promise.resolve(null),
          findPasswordHash: () => Promise.resolve(null),
        }
      );
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('User has no password set');
      }
    });

    it('throws error if password is incorrect', async () => {
      Accounts.config(
        {},
        {
          findUserByUsername: () => Promise.resolve('123'),
          findUserByEmail: () => Promise.resolve(null),
          findPasswordHash: () => Promise.resolve('hash'),
          verifyPassword: () => Promise.resolve(false),
        }
      );
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Incorrect password');
      }
    });

    it('should use custom password authenticator when specified', async () => {
      const user = {
        id: '123',
        username: 'username',
        email: 'email@email.com',
        profile: {
          bio: 'bio',
        },
      };
      const authenticator = jest.fn(() => Promise.resolve(user));

      Accounts.config({ passwordAuthenticator: authenticator }, db);

      const result = await Accounts.loginWithPassword('username', '123456');

      expect(result).toBeDefined();
      expect(authenticator.mock.calls.length).toEqual(1);
    });

    it('return user with custom validation method', async () => {
      const resumeSessionValidator = jest.fn(() => Promise.resolve({}));

      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        { resumeSessionValidator },
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
        }
      );

      const { accessToken } = Accounts.createTokens('456');
      await Accounts.resumeSession(accessToken);

      expect(resumeSessionValidator.mock.calls.length).toBe(1);
    });

    it('throw when custom validation method rejects', async () => {
      const resumeSessionValidator = jest.fn(() =>
        Promise.reject('Custom session error')
      );

      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        { resumeSessionValidator },
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
        }
      );

      const { accessToken } = Accounts.createTokens('456');

      try {
        await Accounts.resumeSession(accessToken);
        throw new Error();
      } catch (err) {
        expect(resumeSessionValidator.mock.calls.length).toBe(1);
        expect(err.message).toEqual('Custom session error');
      }
    });
  });

  describe('loginWithUser', () => {
    it('login using id', async () => {
      const hash = bcryptPassword('1234567');
      const user = {
        id: '123',
        username: 'username',
        email: 'email@email.com',
        profile: {
          bio: 'bio',
        },
      };
      const findUserById = jest.fn(() => Promise.resolve(user));
      Accounts.config(
        {},
        {
          findUserById,
          findPasswordHash: () => Promise.resolve(hash),
          createSession: () => Promise.resolve('sessionId'),
        }
      );
      const res = await Accounts.loginWithPassword({ id: '123' }, '1234567');
      expect(findUserById.mock.calls[0][0]).toEqual('123');
      expect(res.user).toEqual(user);
      const { accessToken, refreshToken } = res.tokens;
      const decodedAccessToken = jwtDecode(accessToken);
      expect(decodedAccessToken.data.sessionId).toEqual('sessionId');
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();
    });

    it('try to login using id and password when id login is not allowed', async () => {
      const hash = bcryptPassword('1234567');
      const user = {
        id: '123',
        username: 'username',
        email: 'email@email.com',
        profile: {
          bio: 'bio',
        },
      };
      const findUserById = jest.fn(() => Promise.resolve(user));
      Accounts.config(
        {
          allowedLoginFields: ['email'],
        },
        {
          findUserById,
          findPasswordHash: () => Promise.resolve(hash),
          createSession: () => Promise.resolve('sessionId'),
        }
      );

      try {
        await Accounts.loginWithPassword({ id: '123' }, '1234567');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Login with id is not allowed!');
      }
    });

    it('try to login using id and password when id login only is allowed ', async () => {
      const hash = bcryptPassword('1234567');
      const user = {
        id: '123',
        username: 'username',
        email: 'email@email.com',
        profile: {
          bio: 'bio',
        },
      };
      const findUserById = jest.fn(() => Promise.resolve(user));
      Accounts.config(
        {
          allowedLoginFields: ['id'],
        },
        {
          findUserById,
          findPasswordHash: () => Promise.resolve(hash),
          createSession: () => Promise.resolve('sessionId'),
        }
      );

      const res = await Accounts.loginWithPassword({ id: '123' }, '1234567');
      expect(res).toBeDefined();
    });

    it('supports hashed password from the client', async () => {
      const hash = bcryptPassword(hashPassword('1234567', 'sha256'));
      const user = {
        id: '123',
        username: 'username',
        email: 'email@email.com',
        profile: {
          bio: 'bio',
        },
      };
      const findUserById = jest.fn(() => Promise.resolve(user));
      Accounts.config(
        {
          passwordHashAlgorithm: 'sha256',
        },
        {
          findUserById,
          findPasswordHash: () => Promise.resolve(hash),
          createSession: () => Promise.resolve('sessionId'),
        }
      );

      const res = await Accounts.loginWithPassword({ id: '123' }, '1234567');
      expect(findUserById.mock.calls[0][0]).toEqual('123');
      expect(res.user).toEqual(user);

      const { accessToken, refreshToken } = res.tokens;
      const decodedAccessToken = jwtDecode(accessToken);
      expect(decodedAccessToken.data.sessionId).toEqual('sessionId');
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();
    });
  });

  describe('refreshTokens', () => {
    it('updates session and returns new tokens and user', async () => {
      const updateSession = jest.fn(() => Promise.resolve());
      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
          updateSession,
        }
      );
      const { accessToken, refreshToken } = Accounts.createTokens('456');
      Accounts.createTokens = () => ({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
      const res = await Accounts.refreshTokens(
        accessToken,
        refreshToken,
        'ip',
        'user agent'
      );
      expect(updateSession.mock.calls[0]).toEqual(['456', 'ip', 'user agent']);
      expect(res.user).toEqual({
        userId: '123',
        username: 'username',
      });
    });

    it('requires access and refresh tokens', async () => {
      Accounts.config({}, {});
      try {
        await Accounts.refreshTokens();
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(
          'An accessToken and refreshToken are required'
        );
      }
    });
    it('throws error if tokens are not valid', async () => {
      Accounts.config({}, {});
      try {
        await Accounts.refreshTokens('bad access token', 'bad refresh token');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Tokens are not valid');
      }
    });
    it('throws error if session not found', async () => {
      Accounts.config(
        {},
        {
          findSessionById: () => Promise.resolve(null),
        }
      );
      try {
        const { accessToken, refreshToken } = Accounts.createTokens();
        await Accounts.refreshTokens(accessToken, refreshToken);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Session not found');
      }
    });
    it('throws error if session not valid', async () => {
      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              valid: false,
            }),
        }
      );
      try {
        const { accessToken, refreshToken } = Accounts.createTokens();
        await Accounts.refreshTokens(accessToken, refreshToken);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Session is no longer valid');
      }
    });
  });

  describe('logout', () => {
    it('throws error if user is not found', async () => {
      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(null),
        }
      );
      try {
        const { accessToken } = Accounts.createTokens('456');
        await Accounts.logout(accessToken);
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('User not found');
      }
    });

    it('invalidates session', async () => {
      const invalidateSession = jest.fn(() => Promise.resolve());
      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
          invalidateSession,
        }
      );
      const { accessToken } = Accounts.createTokens('456');
      await Accounts.logout(accessToken);
      expect(invalidateSession.mock.calls[0]).toEqual(['456']);
    });
  });

  describe('findSessionByAccessToken', () => {
    it('requires access token', async () => {
      Accounts.config({}, {});
      try {
        await Accounts.logout();
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('An accessToken is required');
      }
    });
    it('throws error if tokens are not valid', async () => {
      Accounts.config({}, {});
      try {
        await Accounts.logout('bad access token');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Tokens are not valid');
      }
    });
    it('throws error if session not found', async () => {
      Accounts.config(
        {},
        {
          findSessionById: () => Promise.resolve(null),
        }
      );
      try {
        const { accessToken } = Accounts.createTokens();
        await Accounts.logout(accessToken);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Session not found');
      }
    });
    it('throws error if session not valid', async () => {
      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              valid: false,
            }),
        }
      );
      try {
        const { accessToken } = Accounts.createTokens();
        await Accounts.logout(accessToken);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Session is no longer valid');
      }
    });
  });

  describe('findUserByEmail', () => {
    it('call this.db.findUserByEmail', async () => {
      const findUserByEmail = jest.fn(() => Promise.resolve('user'));
      Accounts.config({}, { findUserByEmail });
      const user = await Accounts.findUserByEmail('email');
      expect(findUserByEmail.mock.calls[0]).toEqual(['email']);
      expect(user).toEqual('user');
    });
  });

  describe('findUserByUsername', () => {
    it('call this.db.findUserByUsername', async () => {
      const findUserByUsername = jest.fn(() => Promise.resolve('user'));
      Accounts.config({}, { findUserByUsername });
      const user = await Accounts.findUserByUsername('username');
      expect(findUserByUsername.mock.calls[0]).toEqual(['username']);
      expect(user).toEqual('user');
    });
  });

  describe('findUserById', () => {
    it('call this.db.findUserById', async () => {
      const findUserById = jest.fn(() => Promise.resolve('user'));
      Accounts.config({}, { findUserById });
      const user = await Accounts.findUserById('id');
      expect(findUserById.mock.calls[0]).toEqual(['id']);
      expect(user).toEqual('user');
    });
  });

  describe('addEmail', () => {
    it('call this.db.addEmail', async () => {
      const addEmail = jest.fn(() => Promise.resolve());
      Accounts.config({}, { addEmail });
      await Accounts.addEmail('id', 'email', true);
      expect(addEmail.mock.calls[0]).toEqual(['id', 'email', true]);
    });
  });

  describe('removeEmail', () => {
    it('call this.db.removeEmail', async () => {
      const removeEmail = jest.fn(() => Promise.resolve());
      Accounts.config({}, { removeEmail });
      await Accounts.removeEmail('id', 'email');
      expect(removeEmail.mock.calls[0]).toEqual(['id', 'email']);
    });
  });

  describe('resumeSession', () => {
    it('throws error if user is not found', async () => {
      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(null),
        }
      );
      try {
        const { accessToken } = Accounts.createTokens('456');
        await Accounts.resumeSession(accessToken);
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('User not found');
      }
    });

    it('return false if session is not valid', async () => {
      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: false,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
        }
      );
      const { accessToken } = Accounts.createTokens('456');
      const ret = await Accounts.resumeSession(accessToken);
      expect(ret).not.toBeTruthy();
    });

    it('return user', async () => {
      const user = {
        userId: '123',
        username: 'username',
      };
      Accounts.config(
        {},
        {
          findSessionById: () =>
            Promise.resolve({
              sessionId: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
        }
      );
      const { accessToken } = Accounts.createTokens('456');
      const foundUser = await Accounts.resumeSession(accessToken);
      expect(foundUser).toEqual(user);
    });
  });

  describe('setProfile', () => {
    it('throws error if user is not found', async () => {
      Accounts.config(
        {},
        {
          findUserById: () => Promise.resolve(null),
        }
      );
      try {
        await Accounts.setProfile();
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('User not found');
      }
    });

    it('calls set profile on db interface', async () => {
      const user = {
        userId: '123',
        username: 'username',
      };
      const profile = {
        bio: 'bio',
      };
      const setProfile = jest.fn();
      Accounts.config(
        {},
        {
          findUserById: () => Promise.resolve(user),
          setProfile,
        }
      );
      await Accounts.setProfile('123', profile);
      expect(setProfile.mock.calls.length).toEqual(1);
      expect(setProfile.mock.calls[0][0]).toEqual('123');
      expect(setProfile.mock.calls[0][1]).toEqual(profile);
    });

    it('merges profile and calls set profile on db interface', async () => {
      const user = {
        userId: '123',
        username: 'username',
        profile: {
          title: 'title',
        },
      };
      const profile = {
        bio: 'bio',
      };
      const mergedProfile = {
        title: 'title',
        bio: 'bio',
      };
      const setProfile = jest.fn(() => mergedProfile);
      Accounts.config(
        {},
        {
          findUserById: () => Promise.resolve(user),
          setProfile,
        }
      );
      const res = await Accounts.updateProfile('123', profile);
      expect(setProfile.mock.calls.length).toEqual(1);
      expect(setProfile.mock.calls[0][0]).toEqual('123');
      expect(setProfile.mock.calls[0][1]).toEqual(mergedProfile);
      expect(res).toEqual(mergedProfile);
    });
  });

  describe('sendVerificationEmail', () => {
    it('throws error if user is not found', async () => {
      Accounts.config(
        {},
        {
          findUserByEmail: () => Promise.resolve(null),
        }
      );
      try {
        await Accounts.sendVerificationEmail();
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('throws when bad email address passed', async () => {
      const user = {
        emails: [{ address: 'email' }],
      };
      Accounts.config(
        {},
        {
          findUserByEmail: () => Promise.resolve(user),
        }
      );
      try {
        await Accounts.sendVerificationEmail('toto');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('No such email address for user');
      }
    });

    it('should send to first unverified email', async () => {
      const user = {
        emails: [{ address: 'email' }],
      };
      Accounts.config(
        {},
        {
          findUserByEmail: () => Promise.resolve(user),
          addEmailVerificationToken: () => Promise.resolve('token'),
        }
      );
      Accounts.email = { sendMail: jest.fn() };
      await Accounts.sendVerificationEmail('email');
      expect(Accounts.email.sendMail.mock.calls.length).toEqual(1);
      expect(Accounts.email.sendMail.mock.calls[0][0].from).toBeTruthy();
      expect(Accounts.email.sendMail.mock.calls[0][0].to).toEqual('email');
      expect(Accounts.email.sendMail.mock.calls[0][0].subject).toBeTruthy();
      expect(Accounts.email.sendMail.mock.calls[0][0].text).toBeTruthy();
    });

    it('should send email', async () => {
      const user = {
        emails: [{ address: 'email' }],
      };
      Accounts.config(
        {},
        {
          findUserByEmail: () => Promise.resolve(user),
          addEmailVerificationToken: () => Promise.resolve('token'),
        }
      );
      Accounts.email = { sendMail: jest.fn() };
      await Accounts.sendVerificationEmail('email');
      expect(Accounts.email.sendMail.mock.calls.length).toEqual(1);
      expect(Accounts.email.sendMail.mock.calls[0][0].from).toBeTruthy();
      expect(Accounts.email.sendMail.mock.calls[0][0].to).toEqual('email');
      expect(Accounts.email.sendMail.mock.calls[0][0].subject).toBeTruthy();
      expect(Accounts.email.sendMail.mock.calls[0][0].text).toBeTruthy();
    });
  });

  describe('sendResetPasswordEmail', () => {
    it('throws error if user is not found', async () => {
      Accounts.config(
        {},
        {
          findUserByEmail: () => Promise.resolve(null),
        }
      );
      try {
        await Accounts.sendResetPasswordEmail();
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('throws when bad email address passed', async () => {
      const user = {
        emails: [{ address: 'email' }],
      };
      Accounts.config(
        {},
        {
          findUserByEmail: () => Promise.resolve(user),
        }
      );
      try {
        await Accounts.sendResetPasswordEmail('toto');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('No such email address for user');
      }
    });

    it('should send to first user email', async () => {
      const user = {
        emails: [{ address: 'email' }],
      };
      Accounts.config(
        {},
        {
          findUserByEmail: () => Promise.resolve(user),
          addResetPasswordToken: () => Promise.resolve('token'),
        }
      );
      Accounts.email = { sendMail: jest.fn() };
      await Accounts.sendResetPasswordEmail('email');
      expect(Accounts.email.sendMail.mock.calls.length).toEqual(1);
      expect(Accounts.email.sendMail.mock.calls[0][0].from).toBeTruthy();
      expect(Accounts.email.sendMail.mock.calls[0][0].to).toEqual('email');
      expect(Accounts.email.sendMail.mock.calls[0][0].subject).toBeTruthy();
      expect(Accounts.email.sendMail.mock.calls[0][0].text).toBeTruthy();
    });

    it('should send email', async () => {
      const user = {
        emails: [{ address: 'email' }],
      };
      Accounts.config(
        {},
        {
          findUserByEmail: () => Promise.resolve(user),
          addResetPasswordToken: () => Promise.resolve('token'),
        }
      );
      Accounts.email = { sendMail: jest.fn() };
      await Accounts.sendResetPasswordEmail('email');
      expect(Accounts.email.sendMail.mock.calls.length).toEqual(1);
      expect(Accounts.email.sendMail.mock.calls[0][0].from).toBeTruthy();
      expect(Accounts.email.sendMail.mock.calls[0][0].to).toEqual('email');
      expect(Accounts.email.sendMail.mock.calls[0][0].subject).toBeTruthy();
      expect(Accounts.email.sendMail.mock.calls[0][0].text).toBeTruthy();
    });
  });

  describe('resetPassword', () => {
    it('should reset the password and invalidate all sessions', async () => {
      const user = {
        id: 'userId',
        emails: [{ address: 'email' }],
        services: {
          password: {
            reset: [
              {
                token: 'token',
                address: 'email',
                when: Date.now(),
                reason: 'reset',
              },
            ],
          },
        },
      };
      const setResetPassswordMock = jest.fn(() => Promise.resolve());
      const invalidateAllSessionsMock = jest.fn();
      Accounts.config(
        {},
        {
          findUserByResetPasswordToken: () => Promise.resolve(user),
          setResetPasssword: setResetPassswordMock,
          invalidateAllSessions: invalidateAllSessionsMock,
        }
      );
      await Accounts.resetPassword('token', 'password');
      expect(setResetPassswordMock.mock.calls.length).toEqual(1);
      expect(setResetPassswordMock.mock.calls[0][0]).toEqual('userId');
      expect(setResetPassswordMock.mock.calls[0][1]).toEqual('email');
      const hashPass = setResetPassswordMock.mock.calls[0][2];
      expect(await verifyPassword('password', hashPass)).toBeTruthy();
      expect(setResetPassswordMock.mock.calls[0][3]).toEqual('token');
      expect(invalidateAllSessionsMock.mock.calls.length).toEqual(1);
      expect(invalidateAllSessionsMock.mock.calls[0]).toEqual(['userId']);
    });

    it('throws when token was not found', async () => {
      const setResetPassswordMock = jest.fn(() => Promise.resolve());
      const invalidateAllSessionsMock = jest.fn();
      Accounts.config(
        {},
        {
          findUserByResetPasswordToken: () => Promise.resolve(null),
          setResetPasssword: setResetPassswordMock,
          invalidateAllSessions: invalidateAllSessionsMock,
        }
      );

      try {
        await Accounts.resetPassword('token', 'password');
        throw new Error();
      } catch (e) {
        expect(e.message).toEqual('Reset password link expired');
        expect(setResetPassswordMock.mock.calls.length).toEqual(0);
        expect(invalidateAllSessionsMock.mock.calls.length).toEqual(0);
      }
    });

    it('throws if token expired', async () => {
      const user = {
        id: 'userId',
        emails: [{ address: 'email' }],
        services: {
          password: {
            reset: [
              {
                token: 'token',
                address: 'email',
                when: 0,
                reason: 'reset',
              },
            ],
          },
        },
      };
      const setResetPassswordMock = jest.fn(() => Promise.resolve());
      const invalidateAllSessionsMock = jest.fn();
      Accounts.config(
        {},
        {
          findUserByResetPasswordToken: () => Promise.resolve(user),
          setResetPasssword: setResetPassswordMock,
          invalidateAllSessions: invalidateAllSessionsMock,
        }
      );

      try {
        await Accounts.resetPassword('token', 'password');
        throw new Error();
      } catch (e) {
        expect(e.message).toEqual('Reset password link expired');
        expect(setResetPassswordMock.mock.calls.length).toEqual(0);
        expect(invalidateAllSessionsMock.mock.calls.length).toEqual(0);
      }
    });

    it('throws if emails mismatch for some reason', async () => {
      const user = {
        id: 'userId',
        emails: [{ address: 'email' }],
        services: {
          password: {
            reset: [
              {
                token: 'token',
                address: 'email2',
                when: Date.now(),
                reason: 'reset',
              },
            ],
          },
        },
      };
      const setResetPassswordMock = jest.fn(() => Promise.resolve());
      const invalidateAllSessionsMock = jest.fn();
      Accounts.config(
        {},
        {
          findUserByResetPasswordToken: () => Promise.resolve(user),
          setResetPasssword: setResetPassswordMock,
          invalidateAllSessions: invalidateAllSessionsMock,
        }
      );

      try {
        await Accounts.resetPassword('token', 'password');
        throw new Error();
      } catch (e) {
        expect(e.message).toEqual('Token has invalid email address');
        expect(setResetPassswordMock.mock.calls.length).toEqual(0);
        expect(invalidateAllSessionsMock.mock.calls.length).toEqual(0);
      }
    });
  });

  describe('sendEnrollmentEmail', () => {
    it('throws error if user not found', async () => {
      Accounts.config(
        {},
        {
          findUserByEmail: () => Promise.resolve(null),
        }
      );
      try {
        await Accounts.sendEnrollmentEmail('email');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });
    it('adds email verification token and sends mail', async () => {
      const addResetPasswordToken = jest.fn();
      const getFirstUserEmail = jest.fn(() => 'user@user.com');
      const sendMail = jest.fn();
      Accounts.config(
        {
          siteUrl: 'siteUrl',
        },
        {
          findUserByEmail: () =>
            Promise.resolve({
              id: 'userId',
              emails: [
                {
                  address: 'user@user.com',
                  verified: false,
                },
              ],
            }),
          addResetPasswordToken,
        }
      );
      Accounts._getFirstUserEmail = getFirstUserEmail;
      Accounts.email.sendMail = sendMail;
      await Accounts.sendEnrollmentEmail('user@user.com');
      expect(addResetPasswordToken.mock.calls[0][0]).toEqual('userId');
      expect(addResetPasswordToken.mock.calls[0][1]).toEqual('user@user.com');
      expect(addResetPasswordToken.mock.calls[0][3]).toEqual('enroll');
      expect(sendMail.mock.calls.length).toEqual(1);
    });
  });

  describe('_getFirstUserEmail', () => {
    it('throws error if email does not exist', () => {
      try {
        Accounts._getFirstUserEmail({
          emails: [
            {
              address: '',
              verified: false,
            },
          ],
        });
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('No such email address for user');
      }
      try {
        Accounts._getFirstUserEmail(
          {
            emails: [
              {
                address: 'wrongemail@email.com',
                verified: false,
              },
            ],
          },
          'email'
        );
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('No such email address for user');
      }
    });
    it('returns first email', () => {
      const email = Accounts._getFirstUserEmail({
        emails: [
          {
            address: 'email@email.com',
            verified: false,
          },
          {
            address: 'another@email.com',
            verified: false,
          },
        ],
      });
      expect(email).toEqual('email@email.com');
    });
  });

  describe('impersonate', () => {
    const user = { username: 'myUser', id: 123 };
    const impersonatedUser = { username: 'impUser', id: 456 };
    const someUser = { username: 'someUser', id: 789 };

    it('throws error if no access token is provided', async () => {
      Accounts.config({}, db);
      try {
        await Accounts.impersonate();
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('An access token is required');
      }
    });

    it('returns not authorized if impersonationAuthorize function is not passed in config', async () => {
      const { accessToken } = Accounts.createTokens('555');
      Accounts.config(
        {
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return (
              userObject.id === user.id &&
              impersonateToUser === impersonatedUser
            );
          },
        },
        {
          findUserById: () => Promise.resolve(user),
          findUserByUsername: () => Promise.resolve(someUser),
        }
      );

      Accounts.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        });

      const impersonationAuthorize = Accounts.options().impersonationAuthorize;
      expect(impersonationAuthorize).toBeDefined();

      const res = await Accounts.impersonate(accessToken, 'someUser');
      expect(res.authorized).toEqual(false);
    });

    it('returns correct response if authorized', async () => {
      const { accessToken } = Accounts.createTokens('555');
      Accounts.config(
        {
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return (
              userObject.id === user.id &&
              impersonateToUser === impersonatedUser
            );
          },
        },
        {
          findUserById: () => Promise.resolve(user),
          findUserByUsername: () => Promise.resolve(impersonatedUser),
          createSession: () => Promise.resolve('001'),
        }
      );

      Accounts.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        });
      Accounts.createTokens = (sessionId, isImpersonated) => ({
        sessionId,
        isImpersonated,
      });

      const res = await Accounts.impersonate(accessToken, 'impUser');
      expect(res).toEqual({
        authorized: true,
        tokens: { sessionId: '001', isImpersonated: true },
        user: impersonatedUser,
      });
    });
  });

  describe('user sanitizer', () => {
    const userObject = { username: 'test', services: [], id: '123' };

    it('internal sanitizer should clean services field from the user object', () => {
      Accounts.config({}, db);
      const modifiedUser = Accounts._sanitizeUser(userObject);
      expect(modifiedUser.services).toBeUndefined();
    });

    it('should run external sanitizier when provided one', () => {
      Accounts.config(
        {
          userObjectSanitizer: (user, omit) => omit(user, ['username']),
        },
        db
      );
      const modifiedUser = Accounts._sanitizeUser(userObject);
      expect(modifiedUser.username).toBeUndefined();
    });
  });
});
