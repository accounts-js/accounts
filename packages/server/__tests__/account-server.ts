import jwtDecode from 'jwt-decode';
import { AccountsServer } from '../src/accounts-server';
import { JwtData } from '../src/types/jwt-data';
import { ServerHooks } from '../src/utils/server-hooks';

const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

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
        new AccountsServer({} as any, {});
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
        const service: any = { authenticate, setStore: jest.fn() };
        const accountServer = new AccountsServer({ db: {} } as any, {
          facebook: service,
        });
        await accountServer.loginWithService('facebook', {}, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when user is deactivated', async () => {
      const authenticate = jest.fn(() => Promise.resolve({ id: 'userId', deactivated: true }));
      try {
        const service: any = { authenticate, setStore: jest.fn() };
        const accountServer = new AccountsServer({ db: {} } as any, {
          facebook: service,
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
      const service: any = { authenticate, setStore: jest.fn() };
      const accountServer = new AccountsServer(
        {
          db: { createSession } as any,
          tokenSecret: 'secret1',
        },
        {
          facebook: service,
        }
      );
      const res = await accountServer.loginWithService('facebook', {}, {});
      expect(res.tokens).toBeTruthy();
    });
  });

  describe('authenticateWithService', () => {
    it('throws on invalid service', async () => {
      try {
        const accountServer = new AccountsServer({ db: {} } as any, {});
        await accountServer.authenticateWithService('facebook', {}, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when user not found', async () => {
      const authenticate = jest.fn(() => Promise.resolve());
      try {
        const service: any = { authenticate, setStore: jest.fn() };
        const accountServer = new AccountsServer({ db: {} } as any, {
          facebook: service,
        });
        await accountServer.authenticateWithService('facebook', {}, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('throws when user is deactivated', async () => {
      const authenticate = jest.fn(() => Promise.resolve({ id: 'userId', deactivated: true }));
      try {
        const service: any = { authenticate, setStore: jest.fn() };
        const accountServer = new AccountsServer({ db: {} } as any, {
          facebook: service,
        });
        await accountServer.authenticateWithService('facebook', {}, {});
        throw new Error();
      } catch (err) {
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should return true upon success', async () => {
      const authenticate = jest.fn(() => Promise.resolve({ id: 'userId' }));
      const createSession = jest.fn(() => Promise.resolve('sessionId'));
      const service: any = { authenticate, setStore: jest.fn() };
      const accountServer = new AccountsServer(
        {
          db: { createSession } as any,
          tokenSecret: 'secret1',
        },
        {
          facebook: service,
        }
      );
      const res = await accountServer.authenticateWithService('facebook', {}, {});
      expect(res).toBeTruthy();
    });
  });

  describe('loginWithUser', () => {
    it('creates a session when given a proper user object', async () => {
      const user = {
        id: '123',
        username: 'username',
        email: 'email@email.com',
        deactivated: false,
      };
      const accountsServer = new AccountsServer(
        {
          db: {
            createSession: () => Promise.resolve('sessionId'),
          } as any,
          tokenSecret: 'secret1',
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
            invalidateSession,
          } as any,
          tokenSecret: 'secret1',
        },
        {}
      );

      const { accessToken } = accountsServer.createTokens({ token: '456', userId: user.userId });
      await accountsServer.logout(accessToken);
      expect(invalidateSession).toHaveBeenCalledWith('456');
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
      const services: any = {
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
          tokenSecret: 'secret1',
        },
        services
      );
      accountsServer.on(ServerHooks.LoginSuccess, hookSpy);
      await accountsServer.loginWithService('password', { key: 'value' }, connectionInfo);
      await delay(10);
      expect(hookSpy).toHaveBeenCalledWith({
        service: 'password',
        connection: connectionInfo,
        user,
        params: { key: 'value' },
      });
    });

    it('ServerHooks.LoginError', async () => {
      const user = { id: 'id-test' };
      const services: any = {
        password: {
          setStore: jest.fn(),
          authenticate: jest.fn(() => Promise.resolve(user)),
        },
      };
      const hookSpy = jest.fn(() => null);
      const SessionError = new Error('Could not create session');
      const accountsServer = new AccountsServer(
        {
          db: {
            createSession: () => {
              throw SessionError;
            },
          } as any,
          tokenSecret: 'secret1',
        },
        services
      );
      accountsServer.on(ServerHooks.LoginError, hookSpy);

      try {
        await accountsServer.loginWithService('password', { key: 'value' }, connectionInfo);
      } catch (e) {
        // nothing to do
      }
      await delay(10);
      expect(hookSpy).toHaveBeenCalledWith({
        service: 'password',
        connection: connectionInfo,
        user,
        params: { key: 'value' },
        error: SessionError,
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
          tokenSecret: 'secret1',
        },
        {}
      );
      accountsServer.on(ServerHooks.LogoutSuccess, hookSpy);

      const { accessToken } = accountsServer.createTokens({ token: '456', userId: user.userId });
      await accountsServer.logout(accessToken);
      await delay(10);
      expect(hookSpy).toHaveBeenCalled();
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
          tokenSecret: 'secret1',
        },
        {}
      );
      accountsServer.on(ServerHooks.LogoutError, hookSpy);

      try {
        const { accessToken } = accountsServer.createTokens({ token: '456', userId: '122' });
        await accountsServer.logout(accessToken);
      } catch (err) {
        // nothing to do
      }
      await delay(10);
      expect(hookSpy).toHaveBeenCalled();
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
          tokenSecret: 'secret1',
        },
        {}
      );
      accountsServer.on(ServerHooks.ResumeSessionSuccess, hookSpy);

      const { accessToken } = accountsServer.createTokens({ token: '456', userId: user.userId });
      await accountsServer.resumeSession(accessToken);
      await delay(10);
      expect(hookSpy).toHaveBeenCalled();
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
          tokenSecret: 'secret1',
          resumeSessionValidator: () => Promise.resolve(user),
        },
        {}
      );
      accountsServer.on(ServerHooks.ResumeSessionError, hookSpy);

      const { accessToken } = accountsServer.createTokens({ token: '456', userId: user.userId });

      try {
        await accountsServer.resumeSession(accessToken);
      } catch (e) {
        // nothing to do
      }
      await delay(10);
      expect(hookSpy).toHaveBeenCalled();
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
          tokenSecret: 'secret1',
          resumeSessionValidator: () => Promise.resolve(user),
        },
        {}
      );
      accountsServer.on(ServerHooks.ResumeSessionError, hookSpy);

      const { accessToken } = accountsServer.createTokens({ token: '456', userId: user.userId });

      try {
        await accountsServer.resumeSession(accessToken);
      } catch (e) {
        // nothing to do
      }
      await delay(10);
      expect(hookSpy).toHaveBeenCalled();
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
          tokenSecret: 'secret1',
        },
        {}
      );
      accountsServer.on(ServerHooks.RefreshTokensError, hookSpy);

      try {
        const { accessToken, refreshToken } = accountsServer.createTokens({
          token: '456',
          userId: 'userId',
        });
        await accountsServer.refreshTokens(accessToken, refreshToken, 'ip', 'userAgent');
      } catch (err) {
        // nothing to do
      }
      await delay(10);
      expect(hookSpy).toHaveBeenCalled();
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
          tokenSecret: 'secret1',
        },
        {}
      );
      accountsServer.on(ServerHooks.RefreshTokensSuccess, hookSpy);

      const { accessToken, refreshToken } = accountsServer.createTokens({
        token: '456',
        userId: user.userId,
      });
      accountsServer.createTokens = () => ({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });

      await accountsServer.refreshTokens(accessToken, refreshToken, 'ip', 'user agent');
      await delay(10);
      expect(hookSpy).toHaveBeenCalled();
    });

    it('ServerHooks.ImpersonationError', async () => {
      const hookSpy = jest.fn(() => null);
      const accountsServer = new AccountsServer(
        {
          db: db as any,
          tokenSecret: 'secret1',
        },
        {}
      );
      accountsServer.on(ServerHooks.ImpersonationError, hookSpy);

      try {
        const accessToken = null as any;
        const impersonated = null as any;
        await accountsServer.impersonate(accessToken, impersonated, 'ip', 'user agent');
      } catch (err) {
        // nothing to do
      }
      await delay(10);
      expect(hookSpy).toHaveBeenCalled();
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
          tokenSecret: 'secret1',
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return userObject.id === user.id && impersonateToUser === impersonatedUser;
          },
        },
        {}
      );
      const { accessToken } = accountsServer.createTokens({ token: '456', userId: user.id });
      const hookSpy = jest.fn(() => null);
      accountsServer.on(ServerHooks.ImpersonationSuccess, hookSpy);

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);
      accountsServer.createTokens = ({ token, isImpersonated = false, userId }) =>
        ({
          isImpersonated,
          token,
          userId,
        } as any);

      await accountsServer.impersonate(accessToken, { userId: 'userId' }, 'ip', 'user agent');
      await delay(10);
      expect(hookSpy).toHaveBeenCalled();
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
          tokenSecret: 'secret1',
        },
        {}
      );
      const { accessToken, refreshToken } = accountsServer.createTokens({
        token: '456',
        userId: user.userId,
      });
      accountsServer.createTokens = () => ({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
      const res = await accountsServer.refreshTokens(accessToken, refreshToken, 'ip', 'user agent');
      expect(updateSession.mock.calls[0]).toEqual([
        '456',
        { ip: 'ip', userAgent: 'user agent' },
        undefined,
      ]);
      expect((res as any).user).toEqual({
        userId: '123',
        username: 'username',
      });
    });

    it('updates session and returns new tokens and user with new session token', async () => {
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
          tokenSecret: 'secret1',
          createNewSessionTokenOnRefresh: true,
          tokenCreator: {
            createToken: async () => {
              return '123';
            },
          },
        },
        {}
      );
      const { accessToken, refreshToken } = accountsServer.createTokens({
        token: '456',
        userId: user.userId,
      });
      accountsServer.createTokens = () => ({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });

      const res = await accountsServer.refreshTokens(accessToken, refreshToken, 'ip', 'user agent');
      expect(updateSession.mock.calls[0]).toEqual([
        '456',
        { ip: 'ip', userAgent: 'user agent' },
        '123',
      ]);
      expect((res as any).user).toEqual({
        userId: '123',
        username: 'username',
      });
    });

    it('requires access and refresh tokens', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenSecret: 'secret1',
        },
        {}
      );
      try {
        const accessToken = null as any;
        const refreshToken = null as any;
        await accountsServer.refreshTokens(accessToken, refreshToken, 'ip', 'user agent');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('An accessToken and refreshToken are required');
      }
    });
    it('throws error if tokens are not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenSecret: 'secret1',
        },
        {}
      );
      try {
        await accountsServer.refreshTokens(
          'bad access token',
          'bad refresh token',
          'ip',
          'user agent'
        );
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
          tokenSecret: 'secret1',
        },
        {}
      );
      try {
        const { accessToken, refreshToken } = accountsServer.createTokens({
          token: '123',
          userId: '213',
        });
        await accountsServer.refreshTokens(accessToken, refreshToken, 'ip', 'user agent');
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
          tokenSecret: 'secret1',
        },
        {}
      );
      try {
        const { accessToken, refreshToken } = accountsServer.createTokens({
          token: '456',
          userId: 'user',
        });
        await accountsServer.refreshTokens(accessToken, refreshToken, 'ip', 'user agent');
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
          tokenSecret: 'secret1',
        },
        {}
      );
      try {
        const { accessToken, refreshToken } = accountsServer.createTokens({
          token: '456',
          userId: 'user',
        });
        await accountsServer.refreshTokens(accessToken, refreshToken, 'ip', 'user agent');
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
          tokenSecret: 'secret1',
        },
        {}
      );
      try {
        const accessToken = null as any;
        await accountsServer.logout(accessToken);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('An accessToken is required');
      }
    });
    it('throws error if tokens are not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenSecret: 'secret1',
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
          tokenSecret: 'secret1',
        },
        {}
      );
      try {
        const { accessToken } = accountsServer.createTokens({
          token: '456',
          userId: 'user',
        });
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
          tokenSecret: 'secret1',
        },
        {}
      );
      try {
        const { accessToken } = accountsServer.createTokens({
          token: '456',
          userId: 'user',
        });
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
          tokenSecret: 'secret1',
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
          tokenSecret: 'secret1',
        },
        {}
      );

      try {
        const { accessToken } = accountsServer.createTokens({ token: '456', userId: 'user' });
        await accountsServer.resumeSession(accessToken);
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('User not found');
      }
    });

    it('should throw if session is not valid', async () => {
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
          tokenSecret: 'secret1',
        },
        {}
      );
      try {
        const { accessToken } = accountsServer.createTokens({ token: '456', userId: user.userId });
        await accountsServer.resumeSession(accessToken);
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Invalid Session');
      }
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
          tokenSecret: 'secret1',
        },
        {}
      );

      const { accessToken } = accountsServer.createTokens({ token: '456', userId: user.userId });
      const foundUser = await accountsServer.resumeSession(accessToken);
      expect(foundUser).toEqual(user);
    });
  });

  describe('deactivateUser', () => {
    it('call this.db.setUserDeactivated', async () => {
      const setUserDeactivated = jest.fn(() => Promise.resolve('user'));
      const accountsServer = new AccountsServer(
        {
          db: { setUserDeactivated } as any,
          tokenSecret: 'secret1',
        },
        {}
      );
      await accountsServer.deactivateUser('id');
      expect(setUserDeactivated.mock.calls[0]).toEqual(['id', true]);
    });
  });

  describe('activateUser', () => {
    it('call this.db.setUserDeactivated', async () => {
      const setUserDeactivated = jest.fn(() => Promise.resolve('user'));
      const accountsServer = new AccountsServer(
        {
          db: { setUserDeactivated } as any,
          tokenSecret: 'secret1',
        },
        {}
      );
      await accountsServer.activateUser('id');
      expect(setUserDeactivated.mock.calls[0]).toEqual(['id', false]);
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
          tokenSecret: 'secret1',
        },
        {}
      );
      try {
        const accessToken = null as any;
        const impersonated = null as any;
        await accountsServer.impersonate(accessToken, impersonated, 'ip', 'user agent');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('An access token is required');
      }
    });

    it('throws error if access token is not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenSecret: 'secret1',
        },
        {}
      );

      try {
        await accountsServer.impersonate('invalidToken', {}, 'ip', 'user agent');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Access token is not valid');
      }
    });

    it('throws error if session is not valid', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {} as any,
          tokenSecret: 'secret1',
        },
        {}
      );
      const { accessToken } = accountsServer.createTokens({ token: '456', userId: 'user' });

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: false,
          userId: '123',
        } as any);

      try {
        await accountsServer.impersonate(accessToken, {}, 'ip', 'user agent');
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
          tokenSecret: 'secret1',
        },
        {}
      );
      const { accessToken } = accountsServer.createTokens({ token: '456', userId: 'user' });

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);

      try {
        await accountsServer.impersonate(accessToken, { userId: 'userId' }, 'ip', 'user agent');
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
          tokenSecret: 'secret1',
          ambiguousErrorMessages: false,
        },
        {}
      );
      const { accessToken } = accountsServer.createTokens({ token: '456', userId: 'user' });

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);

      try {
        await accountsServer.impersonate(accessToken, { userId: 'userId' }, 'ip', 'user agent');
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
          tokenSecret: 'secret1',
        },
        {}
      );
      const { accessToken } = accountsServer.createTokens({ token: '456', userId: 'user' });

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);

      const res = await accountsServer.impersonate(
        accessToken,
        { userId: 'userId' },
        'ip',
        'user agent'
      );
      expect(res.authorized).toEqual(false);
    });

    it('returns not authorized if impersonationAuthorize return false', async () => {
      const accountsServer = new AccountsServer(
        {
          db: {
            findUserById: () => Promise.resolve(user),
            findUserByUsername: () => Promise.resolve(someUser),
          } as any,
          tokenSecret: 'secret1',
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return userObject.id === user.id && impersonateToUser === impersonatedUser;
          },
        },
        {}
      );
      const { accessToken } = accountsServer.createTokens({ token: '456', userId: 'user' });

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);

      const impersonationAuthorize = accountsServer.getOptions().impersonationAuthorize;
      expect(impersonationAuthorize).toBeDefined();

      const res = await accountsServer.impersonate(
        accessToken,
        { userId: 'userId' },
        'ip',
        'user agent'
      );
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
          tokenSecret: 'secret1',
          impersonationAuthorize: async (userObject, impersonateToUser) => {
            return userObject.id === user.id && impersonateToUser === impersonatedUser;
          },
        },
        {}
      );
      const { accessToken } = accountsServer.createTokens({ token: '456', userId: user.id });

      accountsServer.findSessionByAccessToken = () =>
        Promise.resolve({
          valid: true,
          userId: '123',
        } as any);
      accountsServer.createTokens = ({ token, isImpersonated = false }) =>
        ({
          token,
          isImpersonated,
        } as any);

      const res = await accountsServer.impersonate(
        accessToken,
        { userId: 'userId' },
        'ip',
        'user agent'
      );
      expect(res).toEqual({
        authorized: true,
        tokens: { token: '001', isImpersonated: true },
        user: impersonatedUser,
      });
      expect(createSession).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        { ip: 'ip', userAgent: 'user agent' },
        {
          impersonatorUserId: user.id,
        }
      );
    });
  });

  describe('user sanitizer', () => {
    const userObject = { username: 'test', services: [], id: '123', deactivated: false };

    it('internal sanitizer should clean services field from the user object', () => {
      const accountsServer = new AccountsServer(
        {
          db: db as any,
          tokenSecret: 'secret1',
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
          tokenSecret: 'secret1',
          userObjectSanitizer: (user, omit) => omit(user, ['username']),
        },
        {}
      );
      const modifiedUser = accountsServer.sanitizeUser(userObject);
      expect(modifiedUser.username).toBeUndefined();
    });
  });
});
