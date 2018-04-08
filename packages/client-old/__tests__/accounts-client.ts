import { Map } from 'immutable';
import * as crypto from 'crypto';
// tslint:disable-next-line
import * as jwt from 'jsonwebtoken';
import '../src/mock-local-storage.ts';
import Accounts, { TransportInterface } from '../src';
import { setTokens } from '../src/module';

const loggedInUser = {
  user: {
    id: '123',
    username: 'test',
    email: 'test@test.com',
  },
  sessionId: '1',
  tokens: {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  },
};

const impersonateResult = {
  authorized: true,
  tokens: { accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' },
  user: { id: '2', username: 'impUser' },
};

// Mock history object passed to AccountsClient.config
const history = [];

const mockTokenStorage = {
  getItem: () => Promise.resolve('testValue'),
  removeItem: () => Promise.resolve('testValue'),
  setItem: () => Promise.resolve('testValue'),
};

const mockTransport: TransportInterface = {
  createUser: jest.fn(() => Promise.resolve(loggedInUser.user.id)),
  loginWithService: jest.fn(() => Promise.resolve(loggedInUser)),
  logout: jest.fn(() => Promise.resolve()),
  refreshTokens: jest.fn(() => Promise.resolve(loggedInUser)),
  sendResetPasswordEmail: jest.fn(() => Promise.resolve()),
  verifyEmail: jest.fn(() => Promise.resolve()),
  sendVerificationEmail: jest.fn(() => Promise.resolve()),
  impersonate: jest.fn(() => Promise.resolve(impersonateResult)),
};

// tslint:disable-next-line no-string-literal
global['onload'] = () => null;

describe('Accounts', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('config', () => {
    it('requires a transport', async () => {
      try {
        await Accounts.config(
          {
            history,
          },
          undefined
        );
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('A REST or GraphQL transport is required');
      }
    });

    it('should eagerly load tokens from storage after using config', async () => {
      const transport = {
        loginWithPassword: () => Promise.resolve(loggedInUser),
      };

      await Accounts.config(
        {
          history,
          tokenStorage: mockTokenStorage,
        },
        mockTransport
      );

      const tokens = Accounts.tokens();
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
    });

    it('sets the transport', () => {
      const transport = {};
      Accounts.config(
        {
          history,
        },
        mockTransport
      );
      // tslint:disable-next-line no-string-literal
      expect(Accounts.instance['transport']).toEqual(mockTransport);
    });
  });

  describe('createUser', () => {
    it('requires user object', async () => {
      Accounts.config(
        {
          history,
        },
        mockTransport
      );
      try {
        await Accounts.createUser(undefined);
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for create user request');
      }
    });

    it('requires username or an email', async () => {
      Accounts.config({ history }, mockTransport);
      try {
        await Accounts.createUser({
          username: '',
          email: '',
        });
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Username or Email is required');
      }
    });

    it('calls onUserCreated after successful user creation', async () => {
      const onUserCreated = jest.fn();
      Accounts.config(
        {
          history,
          onUserCreated,
        },
        mockTransport
      );

      await Accounts.createUser({
        username: 'user',
      });

      expect(onUserCreated.mock.calls.length).toEqual(1);
      expect(onUserCreated.mock.calls[0][0]).toEqual({ id: '123' });
    });
  });

  describe('login', () => {
    it('throws error if service is undefined', async () => {
      Accounts.config({ history }, mockTransport);
      try {
        await Accounts.loginWithService(undefined, {});
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for login request');
      }
    });

    it('throws error if service is not a string or is an empty object', async () => {
      Accounts.config({ history }, mockTransport);
      try {
        await Accounts.loginWithService({}, { password: 'password' });
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for login request');
      }
    });

    it('calls transport', async () => {
      Accounts.config({ history }, mockTransport);
      await Accounts.loginWithService('password', {
        username: 'user',
        password: 'password',
      });
      expect(mockTransport.loginWithService).toHaveBeenCalledTimes(1);
      expect(mockTransport.loginWithService).toHaveBeenCalledWith('password', {
        username: 'user',
        password: 'password',
      });
    });

    it('calls onSignedInHook on successful login', async () => {
      const onSignedInHook = jest.fn();
      Accounts.config({ history, onSignedInHook }, mockTransport);
      await Accounts.loginWithService('password', {
        username: 'user',
        password: 'password',
      });
      expect(onSignedInHook).toHaveBeenCalledTimes(1);
    });

    it('sets loggingIn flag to false on failed login', async () => {
      const transport = {
        ...mockTransport,
        loginWithService: () => Promise.reject('error'),
      };
      Accounts.config({ history }, transport);
      try {
        await Accounts.loginWithService('password', {
          username: 'user',
          password: 'password',
        });
        throw new Error();
      } catch (err) {
        expect(Accounts.loggingIn()).toBe(false);
      }
    });

    it('stores tokens in local storage', async () => {
      Accounts.config({ history }, mockTransport);
      await Accounts.loginWithService('password', {
        username: 'user',
        password: 'password',
      });
      expect(localStorage.getItem('accounts:accessToken')).toEqual('accessToken');
      expect(localStorage.getItem('accounts:refreshToken')).toEqual('refreshToken');
    });

    it('should return tokens in a sync return value', async () => {
      await Accounts.config(
        {
          history,
          tokenStorage: mockTokenStorage,
        },
        mockTransport
      );

      const tokens = Accounts.tokens();
      expect(tokens.accessToken).toBe('testValue');
      expect(tokens.refreshToken).toBe('testValue');
    });

    it('stores user in redux', async () => {
      Accounts.config({ history }, mockTransport);
      await Accounts.loginWithService('username', 'password');
    });

    it('stores tokens in redux', async () => {
      Accounts.config({ history }, mockTransport);
      await Accounts.loginWithService('username', 'password');
      expect(Accounts.instance.getState().get('tokens')).toEqual(
        Map({
          ...loggedInUser.tokens,
        })
      );
    });
  });

  describe('logout', () => {
    it('calls callback on successful logout', async () => {
      Accounts.config({ history }, mockTransport);
      const callback = jest.fn();
      await Accounts.logout(callback);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('calls onLogout on successful logout', async () => {
      const onSignedOutHook = jest.fn();
      Accounts.config({ history, onSignedOutHook }, mockTransport);
      await Accounts.logout(undefined);
      expect(onSignedOutHook).toHaveBeenCalledTimes(1);
    });

    it('calls callback on failure with error message', async () => {
      const transport = {
        ...mockTransport,
        logout: () => Promise.reject({ message: 'error message' }),
      };
      await Accounts.instance.storeTokens({ accessToken: '1' });
      await Accounts.config({ history }, transport);
      const callback = jest.fn();
      try {
        await Accounts.logout(callback);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('error message');
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith({ message: 'error message' });
      }
    });

    it('clear tokens in redux', async () => {
      const transport = {
        ...mockTransport,
        logout: () => Promise.reject({ message: 'error message' }),
      };
      Accounts.config({ history }, transport);
      await Accounts.instance.storeTokens({ accessToken: '1' });
      await Accounts.instance.loadTokensFromStorage();
      const callback = jest.fn();
      try {
        await Accounts.logout(callback);
        throw new Error();
      } catch (err) {
        expect(Accounts.instance.getState().get('tokens')).toEqual(null);
      }
    });
  });

  describe('refreshSession', async () => {
    // TODO test that user and tokens are cleared if refreshToken is expired
    it('clears tokens and user if tokens are not set', async () => {
      Accounts.config({}, mockTransport);
      Accounts.instance.clearTokens = jest.fn(() => Accounts.instance.clearTokens);
      try {
        await Accounts.refreshSession();
      } catch (err) {
        expect(err.message).toEqual('no tokens provided');
        expect(Accounts.instance.clearTokens).toHaveBeenCalledTimes(1);
      }
    });

    it('clears tokens, users and throws error if bad refresh token provided', async () => {
      localStorage.setItem('accounts:refreshToken', 'bad token');
      localStorage.setItem('accounts:accessToken', 'bad token');
      await Accounts.config({}, mockTransport);
      Accounts.instance.clearTokens = jest.fn(() => Accounts.instance.clearTokens);
      try {
        await Accounts.refreshSession();
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('falsy token provided');
      }
    });

    it('should do nothing if tokens are still valid', async () => {
      Accounts.config({}, mockTransport);
      const accessToken = jwt.sign({ data: 'oldRefreshToken' }, 'secret', {
        expiresIn: 10,
      });
      const refreshToken = jwt.sign({ data: 'oldRefreshToken' }, 'secret', {
        expiresIn: '1d',
      });
      const oldTokens = {
        accessToken,
        refreshToken,
      };
      Accounts.instance.storeTokens(oldTokens);
      // tslint:disable-next-line no-string-literal
      Accounts.instance['store'].dispatch(setTokens(oldTokens));
      await Accounts.refreshSession();
      expect(localStorage.getItem('accounts:accessToken')).toEqual(accessToken);
      expect(localStorage.getItem('accounts:refreshToken')).toEqual(refreshToken);
    });

    it('requests a new token pair, sets the tokens and the user', async () => {
      Accounts.config({}, mockTransport);
      const accessToken = jwt.sign({ data: 'oldRefreshToken' }, 'secret', {
        expiresIn: -10,
      });
      const refreshToken = jwt.sign({ data: 'oldRefreshToken' }, 'secret', {
        expiresIn: '1d',
      });
      const oldTokens = {
        accessToken,
        refreshToken,
      };
      Accounts.instance.storeTokens(oldTokens);
      // tslint:disable-next-line no-string-literal
      Accounts.instance['store'].dispatch(setTokens(oldTokens));
      await Accounts.refreshSession();
      expect(localStorage.getItem('accounts:accessToken')).toEqual('accessToken');
      expect(localStorage.getItem('accounts:refreshToken')).toEqual('refreshToken');
    });
  });

  describe('verifyEmail', () => {
    it('should return an AccountsError', async () => {
      const error = 'something bad';
      Accounts.config(
        {},
        {
          ...mockTransport,
          verifyEmail: () => Promise.reject({ message: error }),
        }
      );
      try {
        await Accounts.verifyEmail(undefined);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(error);
      }
    });

    it('should call transport.verifyEmail', async () => {
      Accounts.config({}, mockTransport);
      await Accounts.verifyEmail('token');
      expect(mockTransport.verifyEmail).toHaveBeenCalledTimes(1);
      expect(mockTransport.verifyEmail).toHaveBeenCalledWith('token');
    });
  });

  describe('impersonate', () => {
    it('should throw error if username is not provided', async () => {
      await Accounts.config({ history }, mockTransport);

      try {
        await Accounts.impersonate(undefined);
      } catch (err) {
        expect(err.message).toEqual('Username is required');
      }
    });

    it('should throw error if already impersonating', async () => {
      await Accounts.config({ history }, mockTransport);
      Accounts.instance.isImpersonated = () => true;

      try {
        await Accounts.impersonate('user');
      } catch (err) {
        expect(err.message).toEqual('User already impersonating');
      }
    });

    it('should throw if no access token is present', async () => {
      const transport = {
        ...mockTransport,
        impersonate: jest.fn(() => Promise.resolve({ authorized: false })),
      };
      await Accounts.config({ history }, transport);

      try {
        await Accounts.impersonate('user');
      } catch (err) {
        expect(err.message).toEqual('There is no access tokens available');
        expect(transport.impersonate).not.toHaveBeenCalled();
      }
    });

    it('should throw if server return unauthorized', async () => {
      const transport = {
        ...mockTransport,
        impersonate: () => Promise.resolve({ authorized: false }),
      };
      await Accounts.instance.storeTokens({ accessToken: '1' });
      await Accounts.config({ history }, transport);

      try {
        await Accounts.impersonate('user');
      } catch (err) {
        expect(err.message).toEqual('User unauthorized to impersonate user');
      }
    });

    it('should set state correctly if impersonation was authorized', async () => {
      await Accounts.config({ history }, mockTransport);
      await Accounts.loginWithService('password', {
        username: 'user',
        password: 'password',
      });

      const result = await Accounts.impersonate('impUser');
      const tokens = Accounts.tokens();
      expect(tokens).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
      expect(Accounts.isImpersonated()).toBe(true);
      expect(Accounts.tokens());
      expect(Accounts.originalTokens()).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      expect(result).toBe(impersonateResult);
    });

    it('should save impersonation state and persist it in the storage', async () => {
      await Accounts.config({ history }, mockTransport);
      await Accounts.loginWithService('password', {
        username: 'user',
        password: 'password',
      });
      Accounts.instance.storeTokens = jest.fn();
      await Accounts.impersonate('impUser');
      expect(Accounts.instance.storeTokens).toHaveBeenCalledTimes(1);
    });

    it('should not save persist impersonation when persistImpersonation=false', async () => {
      await Accounts.config({ history, persistImpersonation: false }, mockTransport);
      await Accounts.loginWithService('password', {
        username: 'user',
        password: 'password',
      });
      Accounts.instance.storeTokens = jest.fn();
      await Accounts.impersonate('impUser');
      expect(Accounts.instance.storeTokens).not.toHaveBeenCalled();
    });
  });

  describe('stopImpersonation', () => {
    it('should not replace tokens if not impersonating', async () => {
      await Accounts.config({ history }, mockTransport);

      await Accounts.loginWithService('password', {
        username: 'user',
        password: 'password',
      });

      expect(Accounts.originalTokens()).toEqual({
        accessToken: null,
        refreshToken: null,
      });
      expect(Accounts.tokens()).toEqual(loggedInUser.tokens);
      await Accounts.stopImpersonation();
      expect(Accounts.originalTokens()).toEqual({
        accessToken: null,
        refreshToken: null,
      });
      expect(Accounts.tokens()).toEqual(loggedInUser.tokens);
    });

    it('should set impersonated state to false', async () => {
      await Accounts.instance.storeTokens({ accessToken: '1' });
      await Accounts.config({ history }, mockTransport);
      Accounts.instance.refreshSession = () => Promise.resolve();

      await Accounts.impersonate('impUser');
      expect(Accounts.isImpersonated()).toBe(true);
      await Accounts.stopImpersonation();
      expect(Accounts.isImpersonated()).toBe(false);
    });

    it('should set the original tokens as current tokens and delete original tokens', async () => {
      await Accounts.config({ history }, mockTransport);
      Accounts.instance.refreshSession = () => Promise.resolve();

      await Accounts.loginWithService('password', {
        username: 'user',
        password: 'password',
      });
      const tokens = Accounts.tokens();

      await Accounts.impersonate('impUser');
      expect(Accounts.tokens()).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
      await Accounts.stopImpersonation();
      expect(Accounts.tokens()).toEqual(tokens);
      expect(Accounts.originalTokens()).toEqual({
        accessToken: null,
        refreshToken: null,
      });
    });
  });
});
