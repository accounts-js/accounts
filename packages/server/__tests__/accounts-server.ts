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
      const authenticate = jest.fn(() => Promise.resolve());
      try {
        const accountServer = new AccountsServer({ db: {} } as any, {
          facebook: { authenticate, setStore: jest.fn() },
        });
        await accountServer.loginWithService('facebook', {}, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should return tokens', async () => {
      const authenticate = jest.fn(() => Promise.resolve({ id: 'userId' }));
      const createSession = jest.fn(() => Promise.resolve('sessionId'));
      const accountServer = new AccountsServer({ 
        db: { createSession} as any,
        tokenSecret: 'secret',
      }, {
        facebook: { authenticate, setStore: jest.fn() },
      });
      const res = await accountServer.loginWithService('facebook', {}, {});
      expect(res.tokens).toBeTruthy();
    });
  });

  describe('loginWithUser', () => {
    it('creates a session when given a proper user object', async () => {
      const hash = bcryptPassword('1234567');
      const user = {
        id: '123',
        username: 'username',
        email: 'email@email.com',
        profile: {
          bio: 'bio',
        },
      };
      const accountsServer = new AccountsServer(
        {
          db: {
            createSession: () => Promise.resolve('sessionId'),
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );

      const res = await accountsServer.loginWithUser(user, {});
      expect(res.user).toEqual(user);
      const { accessToken, refreshToken } = res.tokens;
      const decodedAccessToken: any = jwtDecode(accessToken);
      expect(decodedAccessToken.data.sessionId).toEqual('sessionId');
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('throws error if user is not found', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionById: () =>
              Promise.resolve({
                sessionId: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(null),
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        const { accessToken } = accountsServer.createTokens('456');
        await accountsServer.logout(accessToken);
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

      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionById: () =>
              Promise.resolve({
                sessionId: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
            invalidateSession,
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );

      const { accessToken } = accountsServer.createTokens('456');
      await accountsServer.logout(accessToken);
      expect(invalidateSession.mock.calls[0]).toEqual(['456']);
    });
  });

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

  describe('refreshTokens', () => {
    it('updates session and returns new tokens and user', async () => {
      const updateSession = jest.fn(() => Promise.resolve());
      const user = {
        userId: '123',
        username: 'username',
      };
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionById: () =>
              Promise.resolve({
                sessionId: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
            updateSession,
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );
      const { accessToken, refreshToken } = accountsServer.createTokens('456');
      accountsServer.createTokens = () => ({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
      const res = await accountsServer.refreshTokens(
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
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        await accountsServer.refreshTokens(null, null, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(
          'An accessToken and refreshToken are required'
        );
      }
    });
    it('throws error if tokens are not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        await accountsServer.refreshTokens('bad access token', 'bad refresh token', null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Tokens are not valid');
      }
    });
    it('throws error if session not found', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionById: () => Promise.resolve(null),
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        const { accessToken, refreshToken } = accountsServer.createTokens(null);
        await accountsServer.refreshTokens(accessToken, refreshToken, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Session not found');
      }
    });
    it('throws error if session not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionById: () =>
            Promise.resolve({
              valid: false,
            }),
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        const { accessToken, refreshToken } = accountsServer.createTokens(null);
        await accountsServer.refreshTokens(accessToken, refreshToken, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Session is no longer valid');
      }
    });
  });

  describe('findSessionByAccessToken', () => {
    it('requires access token', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        await accountsServer.logout(null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('An accessToken is required');
      }
    });
    it('throws error if tokens are not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        await accountsServer.logout('bad access token');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Tokens are not valid');
      }
    });
    it('throws error if session not found', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionById: () => Promise.resolve(null),
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        const { accessToken } = accountsServer.createTokens(null);
        await accountsServer.logout(accessToken);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Session not found');
      }
    });
    it('throws error if session not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionById: () =>
              Promise.resolve({
                valid: false,
              }),
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        const { accessToken } = accountsServer.createTokens(null);
        await accountsServer.logout(accessToken);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Session is no longer valid');
      }
    });
  });

  describe('findUserById', () => {
    it('call this.db.findUserById', async () => {
      const findUserById = jest.fn(() => Promise.resolve('user'));
      const accountsServer = new AccountsServer(
        {
          db: { findUserById } as any,
          tokenSecret: 'secret',
        },
        {}
      );
      const user = await accountsServer.findUserById('id');
      expect(findUserById.mock.calls[0]).toEqual(['id']);
      expect(user).toEqual('user');
    });
  });

  describe('resumeSession', () => {
    it('throws error if user is not found', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionById: () =>
              Promise.resolve({
                sessionId: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(null),
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );

      try {
        const { accessToken } = accountsServer.createTokens('456');
        await accountsServer.resumeSession(accessToken);
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
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionById: () =>
              Promise.resolve({
                sessionId: '456',
                valid: false,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );
      const { accessToken } = accountsServer.createTokens('456');
      const ret = await accountsServer.resumeSession(accessToken);
      expect(ret).not.toBeTruthy();
    });

    it('return user', async () => {
      const user = {
        userId: '123',
        username: 'username',
      };
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionById: () =>
              Promise.resolve({
                sessionId: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );

      const { accessToken } = accountsServer.createTokens('456');
      const foundUser = await accountsServer.resumeSession(accessToken);
      expect(foundUser).toEqual(user);
    });
  });

  describe('setProfile', () => {
    it('throws error if user is not found', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById: () => Promise.resolve(null),
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        await accountsServer.setProfile(null, null);
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
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById: () => Promise.resolve(user),
            setProfile,
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );
      
      await accountsServer.setProfile('123', profile);
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
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById: () => Promise.resolve(user),
            setProfile,
          } as any,
          tokenSecret: 'secret',
        },
        {}
      );

      const res = await accountsServer.updateProfile('123', profile);
      expect(setProfile.mock.calls.length).toEqual(1);
      expect(setProfile.mock.calls[0][0]).toEqual('123');
      expect(setProfile.mock.calls[0][1]).toEqual(mergedProfile);
      expect(res).toEqual(mergedProfile);
    });
  });

  describe('impersonate', () => {
    const user = { username: 'myUser', id: '123' };
    const impersonatedUser = { username: 'impUser', id: '456' };
    const someUser = { username: 'someUser', id: '789' };

    it('throws error if no access token is provided', async () => {
      const accountsServer = new AccountsServer(
        {
          db: db as any,
          tokenSecret: 'secret',
        },
        {}
      );
      try {
        await accountsServer.impersonate(null, null, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('An access token is required');
      }
    });

    it('returns not authorized if impersonationAuthorize function is not passed in config', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById: () => Promise.resolve(user),
            findUserByUsername: () => Promise.resolve(someUser),
          } as any,
          tokenSecret: 'secret',
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return (
              userObject.id === user.id &&
              impersonateToUser === impersonatedUser
            );
          },
        },
        {}
      );
      const { accessToken } = accountsServer.createTokens('555');

      
      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);

      const impersonationAuthorize =
        accountsServer.getOptions().impersonationAuthorize;
      expect(impersonationAuthorize).toBeDefined();

      const res = await accountsServer.impersonate(
        accessToken,
        'someUser',
        null,
        null
      );
      expect(res.authorized).toEqual(false);
    });

    it('returns correct response if authorized', async () => {
      const createSession = jest.fn(() => Promise.resolve('001'));
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById: () => Promise.resolve(user),
            findUserByUsername: () => Promise.resolve(impersonatedUser),
            createSession,
          } as any,
          tokenSecret: 'secret',
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return (
              userObject.id === user.id &&
              impersonateToUser === impersonatedUser
            );
          },
        },
        {}
      );
      const { accessToken } = accountsServer.createTokens('555');
      

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);
      accountsServer.createTokens = (sessionId, isImpersonated) => ({
        sessionId,
        isImpersonated,
      } as any);

      const res = await accountsServer.impersonate(accessToken, 'impUser', null, null);
      expect(res).toEqual({
        authorized: true,
        tokens: { sessionId: '001', isImpersonated: true },
        user: impersonatedUser,
      });
      expect(createSession).toHaveBeenCalledWith(
        impersonatedUser.id,
        null,
        null,
        {
          impersonatorUserId: user.id,
        }
      );
    });
  });

  describe('user sanitizer', () => {
    const userObject = { username: 'test', services: [], id: '123' };

    it('internal sanitizer should clean services field from the user object', () => {
      const accountsServer = new AccountsServer(
        {
          db: db as any,
          tokenSecret: 'secret',
        },
        {}
      );
      const modifiedUser = accountsServer.sanitizeUser(userObject);
      expect(modifiedUser.services).toBeUndefined();
    });

    it('should run external sanitizier when provided one', () => {
      const accountsServer = new AccountsServer(
        {
          db: db as any,
          tokenSecret: 'secret',
          userObjectSanitizer: (user, omit) => omit(user, ['username']),
        },
        {}
      );
      const modifiedUser = accountsServer.sanitizeUser(userObject);
      expect(modifiedUser.username).toBeUndefined();
    });
  });
});
