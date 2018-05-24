import * as jwtDecode from 'jwt-decode';
import { AccountsServer } from '../src/accounts-server';
import { JwtData } from '../src/types/jwt-data';
import { bcryptPassword, hashPassword, verifyPassword } from '../src/utils/encryption';
import { ServerHooks } from '../src/utils/server-hooks';

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

  describe('getServices', () => {
    it('should return instance services', async () => {
      const services: any = {
        password: {
          setStore: () => null,
        },
      };
      const account = new AccountsServer({ db: {} } as any, services);
      expect(account.getServices()).toEqual(services);
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
      const accountServer = new AccountsServer(
        {
          db: { createSession } as any,
          tokenSecret: 'secret',
        },
        {
          facebook: { authenticate, setStore: jest.fn() },
        }
      );
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
      const { accessToken, refreshToken } = res.tokens;
      const decodedAccessToken: { data: JwtData } = jwtDecode(accessToken);
      expect(decodedAccessToken.data.token).toBeTruthy();
      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();
    });
  });

  describe('logout', () => {
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
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
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
      expect(invalidateSession).toBeCalledWith('456');
    });
  });

  describe('hooks', () => {
    const connectionInfo = {
      userAgent: 'user-agent-test',
      ip: 'ip-test',
    };
    it('ServerHooks.LoginSuccess', async () => {
      const user = { id: 'id-test' };
      const hookSpy = jest.fn(() => null);
      const services = {
        password: {
          setStore: jest.fn(),
          authenticate: jest.fn(() => Promise.resolve(user)),
        },
      };
      const accountsServer = new AccountsServer(
        {
          db: {
            createSession: () => '123',
          } as any,
          tokenSecret: 'secret',
        },
        services
      );
      accountsServer.on(ServerHooks.LoginSuccess, hookSpy);
      await accountsServer.loginWithService('password', { key: 'value' }, connectionInfo);
      expect(hookSpy).toHaveBeenCalledWith({
        service: 'password',
        connection: connectionInfo,
        user,
      });
    });

    it('ServerHooks.LoginError', async () => {
      const user = { id: 'id-test' };
      const services = {
        password: {
          setStore: jest.fn(),
          authenticate: jest.fn(() => Promise.resolve(user)),
        },
      };
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: {
            createSession: () => {
              throw new Error('Could not create session');
            },
          } as any,
          tokenSecret: 'secret',
        },
        services
      );
      accountsServer.on(ServerHooks.LoginError, hookSpy);

      try {
        await accountsServer.loginWithService('password', { key: 'value' }, connectionInfo);
      } catch (e) {
        // nothing to do
      }
      expect(hookSpy).toHaveBeenCalledWith({
        service: 'password',
        connection: connectionInfo,
        user,
      });
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
          resumeSessionValidator: () => Promise.resolve(user),
        },
        {}
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
          tokenSecret: 'secret',
          resumeSessionValidator: () => Promise.resolve(user),
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return userObject.id === user.id && impersonateToUser === impersonatedUser;
          },
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
            findSessionByToken: () => Promise.resolve(null),
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
            findSessionByToken: () =>
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
          tokenSecret: 'secret',
        },
        {}
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
            findSessionByToken: () => Promise.resolve(null),
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
            findSessionByToken: () =>
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
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
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
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
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
            findSessionByToken: () =>
              Promise.resolve({
                id: '456',
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

    it('throws error if access token is not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
        },
        {}
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
          tokenSecret: 'secret',
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return userObject.id === user.id && impersonateToUser === impersonatedUser;
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
          tokenSecret: 'secret',
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return userObject.id === user.id && impersonateToUser === impersonatedUser;
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
