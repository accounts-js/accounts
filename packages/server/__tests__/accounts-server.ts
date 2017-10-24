import * as jwtDecode from 'jwt-decode';
import { AccountsServer } from '../src/accounts-server';
import {
  bcryptPassword,
  hashPassword,
  verifyPassword,
} from '../src/encryption';

describe('AccountsServer', () => {
  const db = {
    findUserByUsername: () => Promise.resolve(),
    findUserByEmail: () => Promise.resolve(),
    createUser: () => Promise.resolve(),
    createSession: () => Promise.resolve(),
  };

  describe('config', () => {
    it('throws on invalid db', async () => {
      try {
        const account = new AccountsServer({} as any, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });
  });

  describe('loginWithService', () => {
    it('throws on invalid service', async () => {
      try {
        const accountServer = new AccountsServer({ db: {} } as any, {});
        await accountServer.loginWithService('facebook', {}, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when user not found', async () => {
      const authenticate = jest.fn(() => Promise.resolve())
      try {
        const accountServer = new AccountsServer({ db: {} } as any, {
          facebook: { authenticate }
        });
        await accountServer.loginWithService('facebook', {}, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should return tokens', async () => {
      const authenticate = jest.fn(() => Promise.resolve({ id: 'userId' }))
      const createSession = jest.fn(() => Promise.resolve('sessionId'))
      const accountServer = new AccountsServer({ db: {} } as any, {
        facebook: { authenticate }
      });
      accountServer.db = { createSession } as any;
      const res = await accountServer.loginWithService('facebook', {}, {});
      expect(res.tokens).toBeTruthy();
    });
  });

  // describe('logout', () => {
  //   it('throws error if user is not found', async () => {
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: true,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(null),
  //       }
  //     );
  //     try {
  //       const { accessToken } = Accounts.createTokens('456');
  //       await Accounts.logout(accessToken);
  //       throw new Error();
  //     } catch (err) {
  //       const { message } = err;
  //       expect(message).toEqual('User not found');
  //     }
  //   });

  //   it('invalidates session', async () => {
  //     const invalidateSession = jest.fn(() => Promise.resolve());
  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //     };
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: true,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(user),
  //         invalidateSession,
  //       }
  //     );
  //     const { accessToken } = Accounts.createTokens('456');
  //     await Accounts.logout(accessToken);
  //     expect(invalidateSession.mock.calls[0]).toEqual(['456']);
  //   });
  // });

  // describe('hooks', () => {
  //   it('onLoginSuccess', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     const account = new AccountsServer();
  //     account.onLoginSuccess(hookSpy);

  //     account.config(
  //       {
  //         passwordAuthenticator: () => ({}),
  //       },
  //       {
  //         createSession: () => '123',
  //       }
  //     );

  //     await account.loginWithPassword('username', '123456');
  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });
  // });

  //   it('onLoginError with custom authenticator', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onLoginError(hookSpy);

  //     Accounts.config(
  //       {
  //         passwordAuthenticator: () => Promise.reject('error'),
  //       },
  //       {
  //         createSession: () => '123',
  //       }
  //     );

  //     try {
  //       await Accounts.loginWithPassword('username', '123456');
  //     } catch (e) {
  //       // nothing to do
  //     }
  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });

  //   it('onLoginError with default authenticator', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onLoginError(hookSpy);

  //     Accounts.config(
  //       {},
  //       {
  //         findUserByUsername: () => Promise.resolve('123'),
  //         findUserByEmail: () => Promise.resolve(null),
  //         findPasswordHash: () => Promise.resolve('hash'),
  //         verifyPassword: () => Promise.resolve(false),
  //       }
  //     );

  //     try {
  //       await Accounts.loginWithPassword('username', '123456');
  //     } catch (e) {
  //       // Nothing to do
  //     }
  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });

  //   it('onLogoutSuccess', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onLogoutSuccess(hookSpy);

  //     const invalidateSession = jest.fn(() => Promise.resolve());
  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //     };
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: true,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(user),
  //         invalidateSession,
  //       }
  //     );

  //     const { accessToken } = Accounts.createTokens('456');
  //     await Accounts.logout(accessToken);
  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });

  //   it('onLogoutError', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onLogoutError(hookSpy);

  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: true,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(null),
  //       }
  //     );

  //     try {
  //       const { accessToken } = Accounts.createTokens('456');
  //       await Accounts.logout(accessToken);
  //     } catch (err) {
  //       // nothing to do
  //     }

  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });

  //   it('onResumeSessionSuccess', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onResumeSessionSuccess(hookSpy);

  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //     };
  //     Accounts.config(
  //       { resumeSessionValidator: () => Promise.resolve(user) },
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: true,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(user),
  //       }
  //     );

  //     const { accessToken } = Accounts.createTokens('456');
  //     await Accounts.resumeSession(accessToken);

  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });

  //   it('onResumeSessionError with invalid session', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onResumeSessionError(hookSpy);

  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //     };
  //     Accounts.config(
  //       { resumeSessionValidator: () => Promise.resolve(user) },
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: false,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(user),
  //       }
  //     );

  //     const { accessToken } = Accounts.createTokens('456');

  //     try {
  //       await Accounts.resumeSession(accessToken);
  //     } catch (e) {
  //       // nothing to do
  //     }

  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });

  //   it('onResumeSessionError with invalid errored session', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onResumeSessionError(hookSpy);

  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //     };
  //     Accounts.config(
  //       { resumeSessionValidator: () => Promise.resolve(user) },
  //       {
  //         findSessionById: () => Promise.reject(''),
  //         findUserById: () => Promise.resolve(user),
  //       }
  //     );

  //     const { accessToken } = Accounts.createTokens('456');

  //     try {
  //       await Accounts.resumeSession(accessToken);
  //     } catch (e) {
  //       // nothing to do
  //     }

  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });

  //   it('onRefreshTokenError', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onRefreshTokensError(hookSpy);

  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             valid: false,
  //           }),
  //       }
  //     );
  //     try {
  //       const { accessToken, refreshToken } = Accounts.createTokens();
  //       await Accounts.refreshTokens(accessToken, refreshToken);
  //     } catch (err) {
  //       // nothing to do
  //     }

  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });

  //   it('onRefreshTokenSuccess', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onRefreshTokensSuccess(hookSpy);

  //     const updateSession = () => Promise.resolve();
  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //     };
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: true,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(user),
  //         updateSession,
  //       }
  //     );
  //     const { accessToken, refreshToken } = Accounts.createTokens('456');
  //     Accounts.createTokens = () => ({
  //       accessToken: 'newAccessToken',
  //       refreshToken: 'newRefreshToken',
  //     });

  //     await Accounts.refreshTokens(
  //       accessToken,
  //       refreshToken,
  //       'ip',
  //       'user agent'
  //     );

  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });

  //   it('onImpersonationError', async () => {
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onImpersonationError(hookSpy);

  //     Accounts.config({}, db);
  //     try {
  //       await Accounts.impersonate();
  //     } catch (err) {
  //       // nothing to do
  //     }

  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });

  //   it('onImpersonationSuccess', async () => {
  //     const user = { username: 'myUser', id: 123 };
  //     const impersonatedUser = { username: 'impUser', id: 456 };
  //     const { accessToken } = Accounts.createTokens('555');
  //     const hookSpy = jest.fn(() => null);
  //     Accounts.onImpersonationSuccess(hookSpy);

  //     Accounts.config(
  //       {
  //         impersonationAuthorize: async (userObject, impersonateToUser) => {
  //           return (
  //             userObject.id === user.id &&
  //             impersonateToUser === impersonatedUser
  //           );
  //         },
  //       },
  //       {
  //         findUserById: () => Promise.resolve(user),
  //         findUserByUsername: () => Promise.resolve(impersonatedUser),
  //         createSession: () => Promise.resolve('001'),
  //       }
  //     );

  //     Accounts.findSessionByAccessToken = () =>
  //       Promise.resolve({
  //         valid: true,
  //         userId: '123',
  //       });
  //     Accounts.createTokens = (sessionId, isImpersonated) => ({
  //       sessionId,
  //       isImpersonated,
  //     });

  //     await Accounts.impersonate(accessToken, 'impUser');

  //     expect(hookSpy.mock.calls.length).toBe(1);
  //   });
  // });

  // describe('config', () => {
  //   it('requires a db driver', () => {
  //     try {
  //       Accounts.config();
  //       throw new Error();
  //     } catch (err) {
  //       const { message } = err;
  //       expect(message).toEqual('A database driver is required');
  //     }
  //   });

  //   it('sets the db driver', () => {
  //     const testDB = {};
  //     Accounts.config({}, testDB);
  //     expect(Accounts.db).toEqual(testDB);
  //   });

  //   it('set custom password authenticator', () => {
  //     const testDB = {};
  //     Accounts.config({ passwordAuthenticator: () => null }, testDB);
  //     expect(Accounts._options.passwordAuthenticator).toBeDefined();
  //   });

  //   it('set custom userObjectSanitizer', () => {
  //     const testDB = {};
  //     const func = () => null;
  //     Accounts.config({ userObjectSanitizer: func }, testDB);
  //     expect(Accounts._options.userObjectSanitizer).toBe(func);
  //   });

  //   it('use default password authenticator', () => {
  //     const testDB = {};
  //     Accounts.config({}, testDB);
  //     expect(Accounts._options.passwordAuthenticator).toBeUndefined();
  //   });

  //   it('override allowedLoginFields values', () => {
  //     const testDB = {};
  //     Accounts.config({ allowedLoginFields: ['id'] }, testDB);
  //     expect(Accounts._options.allowedLoginFields).toEqual(['id']);
  //   });

  //   it('default allowedLoginFields values', () => {
  //     const testDB = {};
  //     Accounts.config({}, testDB);
  //     expect(Accounts._options.allowedLoginFields).toEqual([
  //       'id',
  //       'email',
  //       'username',
  //     ]);
  //   });
  // });

  // describe('options', () => {
  //   it('should return options', () => {
  //     Accounts.config({ config: 'config' }, {});
  //     const options = Accounts.options();
  //     expect(options.config).toEqual('config');
  //   });
  // });


  // describe('loginWithUser', () => {
  //   it('login using id', async () => {
  //     const hash = bcryptPassword('1234567');
  //     const user = {
  //       id: '123',
  //       username: 'username',
  //       email: 'email@email.com',
  //       profile: {
  //         bio: 'bio',
  //       },
  //     };
  //     const findUserById = jest.fn(() => Promise.resolve(user));
  //     Accounts.config(
  //       {},
  //       {
  //         findUserById,
  //         findPasswordHash: () => Promise.resolve(hash),
  //         createSession: () => Promise.resolve('sessionId'),
  //       }
  //     );
  //     const res = await Accounts.loginWithPassword({ id: '123' }, '1234567');
  //     expect(findUserById.mock.calls[0][0]).toEqual('123');
  //     expect(res.user).toEqual(user);
  //     const { accessToken, refreshToken } = res.tokens;
  //     const decodedAccessToken = jwtDecode(accessToken);
  //     expect(decodedAccessToken.data.sessionId).toEqual('sessionId');
  //     expect(accessToken).toBeTruthy();
  //     expect(refreshToken).toBeTruthy();
  //   });

  //   it('try to login using id and password when id login is not allowed', async () => {
  //     const hash = bcryptPassword('1234567');
  //     const user = {
  //       id: '123',
  //       username: 'username',
  //       email: 'email@email.com',
  //       profile: {
  //         bio: 'bio',
  //       },
  //     };
  //     const findUserById = jest.fn(() => Promise.resolve(user));
  //     Accounts.config(
  //       {
  //         allowedLoginFields: ['email'],
  //       },
  //       {
  //         findUserById,
  //         findPasswordHash: () => Promise.resolve(hash),
  //         createSession: () => Promise.resolve('sessionId'),
  //       }
  //     );

  //     try {
  //       await Accounts.loginWithPassword({ id: '123' }, '1234567');
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('Login with id is not allowed!');
  //     }
  //   });

  //   it('try to login using id and password when id login only is allowed ', async () => {
  //     const hash = bcryptPassword('1234567');
  //     const user = {
  //       id: '123',
  //       username: 'username',
  //       email: 'email@email.com',
  //       profile: {
  //         bio: 'bio',
  //       },
  //     };
  //     const findUserById = jest.fn(() => Promise.resolve(user));
  //     Accounts.config(
  //       {
  //         allowedLoginFields: ['id'],
  //       },
  //       {
  //         findUserById,
  //         findPasswordHash: () => Promise.resolve(hash),
  //         createSession: () => Promise.resolve('sessionId'),
  //       }
  //     );

  //     const res = await Accounts.loginWithPassword({ id: '123' }, '1234567');
  //     expect(res).toBeDefined();
  //   });

  //   it('supports hashed password from the client', async () => {
  //     const hash = bcryptPassword(hashPassword('1234567', 'sha256'));
  //     const user = {
  //       id: '123',
  //       username: 'username',
  //       email: 'email@email.com',
  //       profile: {
  //         bio: 'bio',
  //       },
  //     };
  //     const findUserById = jest.fn(() => Promise.resolve(user));
  //     Accounts.config(
  //       {
  //         passwordHashAlgorithm: 'sha256',
  //       },
  //       {
  //         findUserById,
  //         findPasswordHash: () => Promise.resolve(hash),
  //         createSession: () => Promise.resolve('sessionId'),
  //       }
  //     );

  //     const res = await Accounts.loginWithPassword({ id: '123' }, '1234567');
  //     expect(findUserById.mock.calls[0][0]).toEqual('123');
  //     expect(res.user).toEqual(user);

  //     const { accessToken, refreshToken } = res.tokens;
  //     const decodedAccessToken = jwtDecode(accessToken);
  //     expect(decodedAccessToken.data.sessionId).toEqual('sessionId');
  //     expect(accessToken).toBeTruthy();
  //     expect(refreshToken).toBeTruthy();
  //   });
  // });

  // describe('refreshTokens', () => {
  //   it('updates session and returns new tokens and user', async () => {
  //     const updateSession = jest.fn(() => Promise.resolve());
  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //     };
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: true,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(user),
  //         updateSession,
  //       }
  //     );
  //     const { accessToken, refreshToken } = Accounts.createTokens('456');
  //     Accounts.createTokens = () => ({
  //       accessToken: 'newAccessToken',
  //       refreshToken: 'newRefreshToken',
  //     });
  //     const res = await Accounts.refreshTokens(
  //       accessToken,
  //       refreshToken,
  //       'ip',
  //       'user agent'
  //     );
  //     expect(updateSession.mock.calls[0]).toEqual(['456', 'ip', 'user agent']);
  //     expect(res.user).toEqual({
  //       userId: '123',
  //       username: 'username',
  //     });
  //   });

  //   it('requires access and refresh tokens', async () => {
  //     Accounts.config({}, {});
  //     try {
  //       await Accounts.refreshTokens();
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual(
  //         'An accessToken and refreshToken are required'
  //       );
  //     }
  //   });
  //   it('throws error if tokens are not valid', async () => {
  //     Accounts.config({}, {});
  //     try {
  //       await Accounts.refreshTokens('bad access token', 'bad refresh token');
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('Tokens are not valid');
  //     }
  //   });
  //   it('throws error if session not found', async () => {
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () => Promise.resolve(null),
  //       }
  //     );
  //     try {
  //       const { accessToken, refreshToken } = Accounts.createTokens();
  //       await Accounts.refreshTokens(accessToken, refreshToken);
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('Session not found');
  //     }
  //   });
  //   it('throws error if session not valid', async () => {
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             valid: false,
  //           }),
  //       }
  //     );
  //     try {
  //       const { accessToken, refreshToken } = Accounts.createTokens();
  //       await Accounts.refreshTokens(accessToken, refreshToken);
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('Session is no longer valid');
  //     }
  //   });
  // });

  // describe('findSessionByAccessToken', () => {
  //   it('requires access token', async () => {
  //     Accounts.config({}, {});
  //     try {
  //       await Accounts.logout();
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('An accessToken is required');
  //     }
  //   });
  //   it('throws error if tokens are not valid', async () => {
  //     Accounts.config({}, {});
  //     try {
  //       await Accounts.logout('bad access token');
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('Tokens are not valid');
  //     }
  //   });
  //   it('throws error if session not found', async () => {
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () => Promise.resolve(null),
  //       }
  //     );
  //     try {
  //       const { accessToken } = Accounts.createTokens();
  //       await Accounts.logout(accessToken);
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('Session not found');
  //     }
  //   });
  //   it('throws error if session not valid', async () => {
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             valid: false,
  //           }),
  //       }
  //     );
  //     try {
  //       const { accessToken } = Accounts.createTokens();
  //       await Accounts.logout(accessToken);
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('Session is no longer valid');
  //     }
  //   });
  // });

  // describe('findUserById', () => {
  //   it('call this.db.findUserById', async () => {
  //     const findUserById = jest.fn(() => Promise.resolve('user'));
  //     Accounts.config({}, { findUserById });
  //     const user = await Accounts.findUserById('id');
  //     expect(findUserById.mock.calls[0]).toEqual(['id']);
  //     expect(user).toEqual('user');
  //   });
  // });

  // describe('resumeSession', () => {
  //   it('throws error if user is not found', async () => {
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: true,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(null),
  //       }
  //     );
  //     try {
  //       const { accessToken } = Accounts.createTokens('456');
  //       await Accounts.resumeSession(accessToken);
  //       throw new Error();
  //     } catch (err) {
  //       const { message } = err;
  //       expect(message).toEqual('User not found');
  //     }
  //   });

  //   it('return false if session is not valid', async () => {
  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //     };
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: false,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(user),
  //       }
  //     );
  //     const { accessToken } = Accounts.createTokens('456');
  //     const ret = await Accounts.resumeSession(accessToken);
  //     expect(ret).not.toBeTruthy();
  //   });

  //   it('return user', async () => {
  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //     };
  //     Accounts.config(
  //       {},
  //       {
  //         findSessionById: () =>
  //           Promise.resolve({
  //             sessionId: '456',
  //             valid: true,
  //             userId: '123',
  //           }),
  //         findUserById: () => Promise.resolve(user),
  //       }
  //     );
  //     const { accessToken } = Accounts.createTokens('456');
  //     const foundUser = await Accounts.resumeSession(accessToken);
  //     expect(foundUser).toEqual(user);
  //   });
  // });

  // describe('setProfile', () => {
  //   it('throws error if user is not found', async () => {
  //     Accounts.config(
  //       {},
  //       {
  //         findUserById: () => Promise.resolve(null),
  //       }
  //     );
  //     try {
  //       await Accounts.setProfile();
  //       throw new Error();
  //     } catch (err) {
  //       const { message } = err;
  //       expect(message).toEqual('User not found');
  //     }
  //   });

  //   it('calls set profile on db interface', async () => {
  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //     };
  //     const profile = {
  //       bio: 'bio',
  //     };
  //     const setProfile = jest.fn();
  //     Accounts.config(
  //       {},
  //       {
  //         findUserById: () => Promise.resolve(user),
  //         setProfile,
  //       }
  //     );
  //     await Accounts.setProfile('123', profile);
  //     expect(setProfile.mock.calls.length).toEqual(1);
  //     expect(setProfile.mock.calls[0][0]).toEqual('123');
  //     expect(setProfile.mock.calls[0][1]).toEqual(profile);
  //   });

  //   it('merges profile and calls set profile on db interface', async () => {
  //     const user = {
  //       userId: '123',
  //       username: 'username',
  //       profile: {
  //         title: 'title',
  //       },
  //     };
  //     const profile = {
  //       bio: 'bio',
  //     };
  //     const mergedProfile = {
  //       title: 'title',
  //       bio: 'bio',
  //     };
  //     const setProfile = jest.fn(() => mergedProfile);
  //     Accounts.config(
  //       {},
  //       {
  //         findUserById: () => Promise.resolve(user),
  //         setProfile,
  //       }
  //     );
  //     const res = await Accounts.updateProfile('123', profile);
  //     expect(setProfile.mock.calls.length).toEqual(1);
  //     expect(setProfile.mock.calls[0][0]).toEqual('123');
  //     expect(setProfile.mock.calls[0][1]).toEqual(mergedProfile);
  //     expect(res).toEqual(mergedProfile);
  //   });
  // });

  // describe('getFirstUserEmail', () => {
  //   it('throws error if email does not exist', () => {
  //     try {
  //       Accounts._getFirstUserEmail({
  //         emails: [
  //           {
  //             address: '',
  //             verified: false,
  //           },
  //         ],
  //       });
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('No such email address for user');
  //     }
  //     try {
  //       Accounts._getFirstUserEmail(
  //         {
  //           emails: [
  //             {
  //               address: 'wrongemail@email.com',
  //               verified: false,
  //             },
  //           ],
  //         },
  //         'email'
  //       );
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('No such email address for user');
  //     }
  //   });
  //   it('returns first email', () => {
  //     const email = Accounts._getFirstUserEmail({
  //       emails: [
  //         {
  //           address: 'email@email.com',
  //           verified: false,
  //         },
  //         {
  //           address: 'another@email.com',
  //           verified: false,
  //         },
  //       ],
  //     });
  //     expect(email).toEqual('email@email.com');
  //   });
  // });

  // describe('impersonate', () => {
  //   const user = { username: 'myUser', id: 123 };
  //   const impersonatedUser = { username: 'impUser', id: 456 };
  //   const someUser = { username: 'someUser', id: 789 };

  //   it('throws error if no access token is provided', async () => {
  //     Accounts.config({}, db);
  //     try {
  //       await Accounts.impersonate();
  //       throw new Error();
  //     } catch (err) {
  //       expect(err.message).toEqual('An access token is required');
  //     }
  //   });

  //   it('returns not authorized if impersonationAuthorize function is not passed in config', async () => {
  //     const { accessToken } = Accounts.createTokens('555');
  //     Accounts.config(
  //       {
  //         impersonationAuthorize: async (userObject, impersonateToUser) => {
  //           return (
  //             userObject.id === user.id &&
  //             impersonateToUser === impersonatedUser
  //           );
  //         },
  //       },
  //       {
  //         findUserById: () => Promise.resolve(user),
  //         findUserByUsername: () => Promise.resolve(someUser),
  //       }
  //     );

  //     Accounts.findSessionByAccessToken = () =>
  //       Promise.resolve({
  //         valid: true,
  //         userId: '123',
  //       });

  //     const impersonationAuthorize = Accounts.options().impersonationAuthorize;
  //     expect(impersonationAuthorize).toBeDefined();

  //     const res = await Accounts.impersonate(accessToken, 'someUser');
  //     expect(res.authorized).toEqual(false);
  //   });

  //   it('returns correct response if authorized', async () => {
  //     const { accessToken } = Accounts.createTokens('555');
  //     const createSession = jest.fn(() => Promise.resolve('001'));
  //     Accounts.config(
  //       {
  //         impersonationAuthorize: async (userObject, impersonateToUser) => {
  //           return (
  //             userObject.id === user.id &&
  //             impersonateToUser === impersonatedUser
  //           );
  //         },
  //       },
  //       {
  //         findUserById: () => Promise.resolve(user),
  //         findUserByUsername: () => Promise.resolve(impersonatedUser),
  //         createSession,
  //       }
  //     );

  //     Accounts.findSessionByAccessToken = () =>
  //       Promise.resolve({
  //         valid: true,
  //         userId: '123',
  //       });
  //     Accounts.createTokens = (sessionId, isImpersonated) => ({
  //       sessionId,
  //       isImpersonated,
  //     });

  //     const res = await Accounts.impersonate(accessToken, 'impUser');
  //     expect(res).toEqual({
  //       authorized: true,
  //       tokens: { sessionId: '001', isImpersonated: true },
  //       user: impersonatedUser,
  //     });
  //     expect(
  //       createSession
  //     ).toHaveBeenCalledWith(impersonatedUser.id, undefined, undefined, {
  //       impersonatorUserId: user.id,
  //     });
  //   });
  // });

  // describe('user sanitizer', () => {
  //   const userObject = { username: 'test', services: [], id: '123' };

  //   it('internal sanitizer should clean services field from the user object', () => {
  //     Accounts.config({}, db);
  //     const modifiedUser = Accounts._sanitizeUser(userObject);
  //     expect(modifiedUser.services).toBeUndefined();
  //   });

  //   it('should run external sanitizier when provided one', () => {
  //     Accounts.config(
  //       {
  //         userObjectSanitizer: (user, omit) => omit(user, ['username']),
  //       },
  //       db
  //     );
  //     const modifiedUser = Accounts._sanitizeUser(userObject);
  //     expect(modifiedUser.username).toBeUndefined();
  //   });
  // });
});
