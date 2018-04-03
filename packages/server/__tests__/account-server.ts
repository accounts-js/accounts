import { AccountsServer } from '../src/accounts-server';
import { JwtData } from '../src/types/jwt-data';
import { ServerHooks } from '../src/utils/server-hooks';
import TokenManager from '@accounts/token-manager';

const tokenManager = new TokenManager({
  secret: 'secret',
});

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

  describe('config', () => {
    it('throws on invalid tokenManager', async () => {
      try {
        const account = new AccountsServer({ db: {} } as any, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });
  });

  describe('getServices', () => {
    it('should return instance services', async () => {
      const passwordService = {
        serviceName: 'password',
        link: () => passwordService
      }
      const authenticationServices = [passwordService]

      const expectedServices: any = {
        password: passwordService
      };
      const account = new AccountsServer({ 
        db: {},
        tokenManager,
        authenticationServices
      } as any);
      expect(account.getServices()).toEqual(expectedServices);
    });
  });

  describe('loginWithService', () => {
    it('throws on invalid service', async () => {
      try {
        const accountServer = new AccountsServer({ db: {}, tokenManager } as any);
        await accountServer.loginWithService('facebook', {}, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when user not found', async () => {
      const authenticate = jest.fn(() => Promise.resolve());
      try {
        const facebookService = {
          serviceName: 'facebook',
          link: () => facebookService,
          authenticate
        }
        const authenticationServices = [facebookService]
        const accountServer = new AccountsServer({ db: {}, authenticationServices, tokenManager } as any);
        await accountServer.loginWithService('facebook', {}, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should return tokens', async () => {
      const authenticate = jest.fn(() => Promise.resolve({ id: 'userId' }));
      const createSession = jest.fn(() => Promise.resolve('sessionId'));
      const facebookService = {
        serviceName: 'facebook',
        link: () => facebookService,
        authenticate
      }
      const authenticationServices = [facebookService]
      const accountServer = new AccountsServer({ 
        db: { createSession }, 
        authenticationServices, 
        tokenManager
      } as any);
      const res = await accountServer.loginWithService('facebook', {}, {});
      expect(res.tokens).toBeTruthy();
    });
  });

  describe('loginWithUser', () => {
    it('creates a session when given a proper user object', async () => {
      const user = {
        id: '123',
        username: 'username',
        email: 'email@email.com',
        profile: {
          bio: 'bio',
        },
      };
      const accountsServer = new AccountsServer({
        db: {
          createSession: () => Promise.resolve('sessionId'),
        } as any,
        tokenManager,
      });

      const res = await accountsServer.loginWithUser(user, {});
      const { accessToken, refreshToken } = res.tokens;
      const decodedAccessToken: { data: JwtData } = accountsServer.tokenManager.decodeToken(
        accessToken
      );
      expect(decodedAccessToken.data.token).toBeTruthy();
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('throws error if user is not found', async () => {
      const accountsServer = new AccountsServer({
        db: {
          findSessionByToken: () =>
            Promise.resolve({
              id: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(null),
        } as any,
        tokenManager,
      });
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

      const accountsServer = new AccountsServer({
        db: {
          findSessionByToken: () =>
            Promise.resolve({
              id: '456',
              valid: true,
              userId: '123',
            }),
          findUserById: () => Promise.resolve(user),
          invalidateSession,
        } as any,
        tokenManager,
      });

      const { accessToken } = accountsServer.createTokens('456');
      await accountsServer.logout(accessToken);
      expect(invalidateSession).toBeCalledWith('456');
    });
  });

  describe('hooks', () => {
    it('ServerHooks.LoginSuccess', async () => {
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: {
            createSession: () => '123',
          } as any,
          tokenManager,
        }
      );
      accountsServer.on(ServerHooks.LoginSuccess, hookSpy);

      await accountsServer.loginWithUser({} as any, {});
      expect(hookSpy).toBeCalled();
    });

    it('ServerHooks.LoginError', async () => {
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: {
            createSession: () => {
              throw new Error('Could not create session');
            },
          } as any,
          tokenManager,
        }
      );
      accountsServer.on(ServerHooks.LoginError, hookSpy);

      try {
        await accountsServer.loginWithUser({} as any, {});
      } catch (e) {
        // nothing to do
      }
      expect(hookSpy).toBeCalled();
    });

    it('ServerHooks.LogoutSuccess', async () => {
      const user = {
        userId: '123',
        username: 'username',
      };

      const hookSpy = jest.fn(() => null);
      const invalidateSession = jest.fn(() => Promise.resolve());
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
            invalidateSession,
          } as any,
          tokenManager,
        }
      );
      accountsServer.on(ServerHooks.LogoutSuccess, hookSpy);

      const { accessToken } = accountsServer.createTokens('456');
      await accountsServer.logout(accessToken);
      expect(hookSpy).toBeCalled();
    });

    it('ServerHooks.LogoutError', async () => {
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(null),
          } as any,
          tokenManager,
        }
      );
      accountsServer.on(ServerHooks.LogoutError, hookSpy);

      try {
        const { accessToken } = accountsServer.createTokens('456');
        await accountsServer.logout(accessToken);
      } catch (err) {
        // nothing to do
      }

      expect(hookSpy).toBeCalled();
    });

    it('ServerHooks.ResumeSessionSuccess', async () => {
      const user = {
        userId: '123',
        username: 'username',
      };
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
            resumeSessionValidator: () => Promise.resolve(user),
          } as any,
          tokenManager,
        }
      );
      accountsServer.on(ServerHooks.ResumeSessionSuccess, hookSpy);

      const { accessToken } = accountsServer.createTokens('456');
      await accountsServer.resumeSession(accessToken);

      expect(hookSpy).toBeCalled();
    });

    it('ServerHooks.ResumeSessionError with invalid session', async () => {
      const user = {
        userId: '123',
        username: 'username',
      };
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
                valid: false,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
          } as any,
          tokenManager,
          resumeSessionValidator: () => Promise.resolve(user),
        }
      );
      accountsServer.on(ServerHooks.ResumeSessionError, hookSpy);

      const { accessToken } = accountsServer.createTokens('456');

      try {
        await accountsServer.resumeSession(accessToken);
      } catch (e) {
        // nothing to do
      }

      expect(hookSpy).toBeCalled();
    });

    it('ServerHooks.ResumeSessionError with invalid errored session', async () => {
      const user = {
        userId: '123',
        username: 'username',
      };
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionByToken: () => Promise.reject(''),
            findUserById: () => Promise.resolve(user),
          } as any,
          tokenManager,
          resumeSessionValidator: () => Promise.resolve(user),
        }
      );
      accountsServer.on(ServerHooks.ResumeSessionError, hookSpy);

      const { accessToken } = accountsServer.createTokens('456');

      try {
        await accountsServer.resumeSession(accessToken);
      } catch (e) {
        // nothing to do
      }

      expect(hookSpy).toBeCalled();
    });

    it('ServerHooks.RefreshTokensError', async () => {
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionByToken: () =>
              Promise.resolve({
                valid: false,
              }),
          } as any,
          tokenManager,
        }
      );
      accountsServer.on(ServerHooks.RefreshTokensError, hookSpy);

      try {
        const { accessToken, refreshToken } = accountsServer.createTokens(null);
        await accountsServer.refreshTokens(accessToken, refreshToken, null, null);
      } catch (err) {
        // nothing to do
      }

      expect(hookSpy).toBeCalled();
    });

    it('ServerHooks.RefreshTokensSuccess', async () => {
      const user = {
        userId: '123',
        username: 'username',
      };
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
            updateSession: () => Promise.resolve(),
          } as any,
          tokenManager,
        }
      );
      accountsServer.on(ServerHooks.RefreshTokensSuccess, hookSpy);

      const { accessToken, refreshToken } = accountsServer.createTokens('456');
      accountsServer.createTokens = () => ({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });

      await accountsServer.refreshTokens(accessToken, refreshToken, 'ip', 'user agent');

      expect(hookSpy).toBeCalled();
    });

    it('ServerHooks.ImpersonationError', async () => {
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: db as any,
          tokenManager,
        }
      );
      accountsServer.on(ServerHooks.ImpersonationError, hookSpy);

      try {
        await accountsServer.impersonate(null, null, null, null);
      } catch (err) {
        // nothing to do
      }

      expect(hookSpy).toBeCalled();
    });

    it('ServerHooks.ImpersonationSuccess', async () => {
      const user = { username: 'myUser', id: '123' };
      const impersonatedUser = { username: 'impUser', id: '456' };
      const findUserById = jest.fn();
      findUserById.mockReturnValueOnce(user).mockReturnValueOnce(impersonatedUser);
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById,
            createSession: () => Promise.resolve('001'),
          } as any,
          tokenManager,
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return userObject.id === user.id && impersonateToUser === impersonatedUser;
          },
        }
      );
      const { accessToken } = accountsServer.createTokens('555');
      const hookSpy = jest.fn(() => null);
      accountsServer.on(ServerHooks.ImpersonationSuccess, hookSpy);

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);
      accountsServer.createTokens = (sessionId, isImpersonated) =>
        ({
          sessionId,
          isImpersonated,
        } as any);

      await accountsServer.impersonate(accessToken, { userId: 'userId' }, null, null);

      expect(hookSpy).toBeCalled();
    });
  });

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
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
            updateSession,
          } as any,
          tokenManager,
        }
      );
      const { accessToken, refreshToken } = accountsServer.createTokens('456');
      accountsServer.createTokens = () => ({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
      const res = await accountsServer.refreshTokens(accessToken, refreshToken, 'ip', 'user agent');
      expect(updateSession.mock.calls[0]).toEqual(['456', { ip: 'ip', userAgent: 'user agent' }]);
      expect(res.user).toEqual({
        userId: '123',
        username: 'username',
      });
    });

    it('requires access and refresh tokens', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenManager,
        }
      );
      try {
        await accountsServer.refreshTokens(null, null, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('An accessToken and refreshToken are required');
      }
    });
    it('throws error if tokens are not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenManager,
        }
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
            findSessionByToken: () => Promise.resolve(null),
          } as any,
          tokenManager,
        }
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
            findSessionByToken: () =>
              Promise.resolve({
                valid: false,
              }),
          } as any,
          tokenManager,
        }
      );
      try {
        const { accessToken, refreshToken } = accountsServer.createTokens(null);
        await accountsServer.refreshTokens(accessToken, refreshToken, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Session is no longer valid');
      }
    });

    it('throws error if user not found', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(null),
          } as any,
          tokenManager,
        }
      );
      try {
        const { accessToken, refreshToken } = accountsServer.createTokens(null);
        await accountsServer.refreshTokens(accessToken, refreshToken, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });
  });

  describe('findSessionByAccessToken', () => {
    it('requires access token', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenManager,
        }
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
          tokenManager,
        }
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
            findSessionByToken: () => Promise.resolve(null),
          } as any,
          tokenManager,
        }
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
            findSessionByToken: () =>
              Promise.resolve({
                valid: false,
              }),
          } as any,
          tokenManager,
        }
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
          tokenManager,
        }
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
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(null),
          } as any,
          tokenManager,
        }
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
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
                valid: false,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
          } as any,
          tokenManager,
        }
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
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
                valid: true,
                userId: '123',
              }),
            findUserById: () => Promise.resolve(user),
          } as any,
          tokenManager,
        }
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
          tokenManager,
        }
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
          tokenManager,
        }
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
          tokenManager,
        }
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
          tokenManager,
        }
      );
      try {
        await accountsServer.impersonate(null, null, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('An access token is required');
      }
    });

    it('throws error if access token is not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenManager,
        }
      );

      try {
        const res = await accountsServer.impersonate('invalidToken', {}, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Access token is not valid');
      }
    });

    it('throws error if session is not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenManager,
        }
      );
      const { accessToken } = accountsServer.createTokens('555');

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: false,
          userId: '123',
        } as any);

      try {
        const res = await accountsServer.impersonate(accessToken, {}, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Session is not valid for user');
      }
    });

    it('throws error if user is not found', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById: () => Promise.resolve(null),
          } as any,
          tokenManager,
        }
      );
      const { accessToken } = accountsServer.createTokens('555');

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);

      try {
        const res = await accountsServer.impersonate(accessToken, { userId: 'userId' }, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('User not found');
      }
    });

    it('throws error if impersonated user is not found', async () => {
      const findUserById = jest.fn();
      findUserById.mockReturnValueOnce(user);
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById,
            findUserByUsername: () => Promise.resolve(null),
          } as any,
          tokenManager,
        }
      );
      const { accessToken } = accountsServer.createTokens('555');

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);

      try {
        const res = await accountsServer.impersonate(accessToken, { userId: 'userId' }, null, null);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Impersonated user not found');
      }
    });

    it('returns not authorized if impersonationAuthorize function is not passed in config', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById: () => Promise.resolve(user),
            findUserByUsername: () => Promise.resolve(someUser),
          } as any,
          tokenManager,
        }
      );
      const { accessToken } = accountsServer.createTokens('555');

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);

      const res = await accountsServer.impersonate(accessToken, { userId: 'userId' }, null, null);
      expect(res.authorized).toEqual(false);
    });

    it('returns not authorized if impersonationAuthorize return false', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById: () => Promise.resolve(user),
            findUserByUsername: () => Promise.resolve(someUser),
          } as any,
          tokenManager,

          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return userObject.id === user.id && impersonateToUser === impersonatedUser;
          },
        }
      );
      const { accessToken } = accountsServer.createTokens('555');

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);

      const impersonationAuthorize = accountsServer.getOptions().impersonationAuthorize;
      expect(impersonationAuthorize).toBeDefined();

      const res = await accountsServer.impersonate(accessToken, { userId: 'userId' }, null, null);
      expect(res.authorized).toEqual(false);
    });

    it('returns correct response if authorized', async () => {
      const createSession = jest.fn(() => Promise.resolve('001'));
      const findUserById = jest.fn();
      findUserById.mockReturnValueOnce(user).mockReturnValueOnce(impersonatedUser);
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById,
            createSession,
          } as any,
          tokenManager,

          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return userObject.id === user.id && impersonateToUser === impersonatedUser;
          },
        }
      );
      const { accessToken } = accountsServer.createTokens('555');

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);
      accountsServer.createTokens = (sessionId, isImpersonated) =>
        ({
          sessionId,
          isImpersonated,
        } as any);

      const res = await accountsServer.impersonate(accessToken, { userId: 'userId' }, null, null);
      expect(res).toEqual({
        authorized: true,
        tokens: { sessionId: '001', isImpersonated: true },
        user: impersonatedUser,
      });
      expect(createSession.mock.calls[0][3]).toEqual({
        impersonatorUserId: user.id,
      });
    });
  });

  describe('user sanitizer', () => {
    const userObject = { username: 'test', services: [], id: '123' };

    it('internal sanitizer should clean services field from the user object', () => {
      const accountsServer = new AccountsServer(
        {
          db: db as any,
          tokenManager,
        }
      );
      const modifiedUser = accountsServer.sanitizeUser(userObject);
      expect(modifiedUser.services).toBeUndefined();
    });

    it('should run external sanitizier when provided one', () => {
      const accountsServer = new AccountsServer(
        {
          db: db as any,
          tokenManager,

          userObjectSanitizer: (user, omit) => omit(user, ['username']),
        }
      );
      const modifiedUser = accountsServer.sanitizeUser(userObject);
      expect(modifiedUser.username).toBeUndefined();
    });
  });
});
