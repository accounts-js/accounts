import { Map } from 'immutable';
import * as crypto from 'crypto';
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
  loginWithPassword: jest.fn(() => Promise.resolve(loggedInUser)),
  logout: jest.fn(() => Promise.resolve()),
  refreshTokens: jest.fn(() => Promise.resolve(loggedInUser)),
  resetPassword: jest.fn(() => Promise.resolve()),
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

    it('requires password', async () => {
      await Accounts.config(
        {
          history,
        },
        mockTransport
      );
      try {
        await Accounts.createUser({
          password: null,
        });
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Password is required');
      }
    });

    it('requires username or an email', async () => {
      Accounts.config({ history }, mockTransport);
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

    it('calls callback on successful user creation', async () => {
      const callback = jest.fn();
      await Accounts.config({ history }, mockTransport);
      await Accounts.createUser(
        {
          password: '123456',
          username: 'user',
        },
        callback
      );

      expect(callback.mock.calls.length).toEqual(1);
    });
    it('calls callback on failure with error message', async () => {
      const transport = {
        ...mockTransport,
        createUser: () => Promise.reject('error message'),
      };

      await Accounts.config({ history }, transport);
      const callback = jest.fn();

      try {
        await Accounts.createUser(
          {
            password: '123456',
            username: 'user',
          },
          callback
        );
        throw new Error();
      } catch (err) {
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toBeCalledWith('error message');
      }
    });

    it('calls login function with user id and password of created user', async () => {
      Accounts.config({ history }, mockTransport);

      Accounts.instance.loginWithPassword = jest.fn(
        () => Accounts.instance.loginWithPassword
      );

      await Accounts.createUser({
        password: '123456',
        username: 'user',
      });

      expect(Accounts.instance.loginWithPassword).toHaveBeenCalledWith(
        { id: '123' },
        '123456'
      );
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
        password: '123456',
        username: 'user',
      });

      expect(onUserCreated.mock.calls.length).toEqual(1);
      expect(onUserCreated.mock.calls[0][0]).toEqual({ id: '123' });
    });
  });

  describe('loginWithPassword', () => {
    it('throws error if password is undefined', async () => {
      Accounts.config({ history }, mockTransport);
      try {
        await Accounts.loginWithPassword(undefined, undefined);
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for login request');
      }
    });

    it('throws error if user is undefined', async () => {
      Accounts.config({ history }, mockTransport);
      try {
        await Accounts.loginWithPassword(undefined, undefined);
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for login request');
      }
    });

    it('throws error user is not a string or is an empty object', async () => {
      Accounts.config({ history }, mockTransport);
      try {
        await Accounts.loginWithPassword({}, 'password');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Match failed');
      }
    });

    it('throws error password is not a string', async () => {
      Accounts.config({ history }, mockTransport);
      try {
        await Accounts.loginWithPassword({ username: 'username' }, {});
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Match failed');
      }
    });

    it('calls callback on successful login', async () => {
      Accounts.config({ history }, mockTransport);
      const callback = jest.fn();
      await Accounts.loginWithPassword('username', 'password', callback);
      expect(callback.mock.calls.length).toEqual(1);
      expect(Accounts.loggingIn()).toBe(false);
    });

    it('calls transport', async () => {
      Accounts.config({ history }, mockTransport);
      await Accounts.loginWithPassword('username', 'password');
      expect(mockTransport.loginWithPassword).toHaveBeenCalledTimes(1);
      expect(mockTransport.loginWithPassword).toHaveBeenCalledWith(
        'username',
        'password'
      );
    });

    it('calls callback with error on failed login', async () => {
      const transport = {
        ...mockTransport,
        loginWithPassword: () => Promise.reject('error'),
      };
      Accounts.config({ history }, transport);
      const callback = jest.fn();
      try {
        await Accounts.loginWithPassword('username', 'password', callback);
        throw new Error();
      } catch (err) {
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('error', null);
      }
    });

    it('calls onSignedInHook on successful login', async () => {
      const onSignedInHook = jest.fn();
      Accounts.config({ history, onSignedInHook }, mockTransport);
      await Accounts.loginWithPassword('username', 'password');
      expect(onSignedInHook).toHaveBeenCalledTimes(1);
    });

    it('sets loggingIn flag to false on failed login', async () => {
      const transport = {
        ...mockTransport,
        loginWithPassword: () => Promise.reject('error'),
      };
      Accounts.config({ history }, transport);
      try {
        await Accounts.loginWithPassword('username', 'password');
        throw new Error();
      } catch (err) {
        expect(Accounts.loggingIn()).toBe(false);
      }
    });

    it('stores tokens in local storage', async () => {
      Accounts.config({ history }, mockTransport);
      await Accounts.loginWithPassword('username', 'password');
      expect(localStorage.getItem('accounts:accessToken')).toEqual(
        'accessToken'
      );
      expect(localStorage.getItem('accounts:refreshToken')).toEqual(
        'refreshToken'
      );
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
      await Accounts.loginWithPassword('username', 'password');
      expect(Accounts.instance.getState().get('user')).toEqual(
        Map({
          ...loggedInUser.user,
        })
      );
    });

    it('stores tokens in redux', async () => {
      Accounts.config({ history }, mockTransport);
      await Accounts.loginWithPassword('username', 'password');
      expect(Accounts.instance.getState().get('tokens')).toEqual(
        Map({
          ...loggedInUser.tokens,
        })
      );
    });

    it('can hash password with specified algorithm', async () => {
      Accounts.config(
        {
          history,
          passwordHashAlgorithm: 'sha256',
        },
        mockTransport
      );
      const hashed = {
        digest: crypto.createHash('sha256').update('password').digest('hex'),
        algorithm: 'sha256',
      };
      await Accounts.loginWithPassword('username', 'password');
      expect(mockTransport.loginWithPassword).toHaveBeenCalledTimes(1);
      expect(mockTransport.loginWithPassword).toBeCalledWith(
        'username',
        hashed
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

    it('clear user in redux', async () => {
      const transport = {
        ...mockTransport,
        logout: () => Promise.reject({ message: 'error message' }),
      };
      Accounts.instance.storeTokens({ accessToken: '1' });
      Accounts.config({ history }, transport);
      const callback = jest.fn();
      try {
        await Accounts.logout(callback);
        throw new Error();
      } catch (err) {
        expect(Accounts.instance.getState().get('user')).toEqual(null);
      }
    });
  });

  describe('refreshSession', async () => {
    // TODO test that user and tokens are cleared if refreshToken is expired
    it('clears tokens and user if tokens are not set', async () => {
      Accounts.config({}, mockTransport);
      Accounts.instance.clearTokens = jest.fn(
        () => Accounts.instance.clearTokens
      );
      Accounts.instance.clearUser = jest.fn(() => Accounts.instance.clearUser);
      try {
        await Accounts.refreshSession();
      } catch (err) {
        expect(err.message).toEqual('no tokens provided');
        expect(Accounts.instance.clearTokens).toHaveBeenCalledTimes(1);
        expect(Accounts.instance.clearUser).toHaveBeenCalledTimes(1);
      }
    });

    it('clears tokens, users and throws error if bad refresh token provided', async () => {
      localStorage.setItem('accounts:refreshToken', 'bad token');
      localStorage.setItem('accounts:accessToken', 'bad token');
      await Accounts.config({}, mockTransport);
      Accounts.instance.clearTokens = jest.fn(
        () => Accounts.instance.clearTokens
      );
      Accounts.instance.clearUser = jest.fn(() => Accounts.instance.clearUser);
      try {
        await Accounts.refreshSession();
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('falsy token provided');
      }
    });

    it('requests a new token pair, sets the tokens and the user', async () => {
      Accounts.config({}, mockTransport);
      const oldTokens = {
        accessToken: 'oldAccessToken',
        refreshToken: jwt.sign({ data: 'oldRefreshToken' }, 'secret', {
          expiresIn: '1d',
        }),
      };
      // tslint:disable-next-line no-string-literal
      Accounts.instance['store'].dispatch(setTokens(oldTokens));
      await Accounts.refreshSession();
      expect(localStorage.getItem('accounts:accessToken')).toEqual(
        'accessToken'
      );
      expect(localStorage.getItem('accounts:refreshToken')).toEqual(
        'refreshToken'
      );
      expect(Accounts.user()).toEqual(loggedInUser.user);
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

  describe('resetPassword', () => {
    it('should return an AccountsError', async () => {
      const error = 'something bad';
      await Accounts.config(
        {},
        {
          ...mockTransport,
          resetPassword: () => Promise.reject({ message: error }),
        }
      );
      try {
        await Accounts.resetPassword('badtoken', 'password');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(error);
      }
    });

    it('throws if password is invalid', async () => {
      await Accounts.config({}, mockTransport);
      try {
        await Accounts.resetPassword(undefined, undefined);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Password is invalid!');
      }
    });

    it('should call transport.resetPassword', async () => {
      Accounts.config({}, mockTransport);
      await Accounts.resetPassword('token', 'newPassword');
      expect(mockTransport.resetPassword).toHaveBeenCalledTimes(1);
      expect(mockTransport.resetPassword).toHaveBeenCalledWith(
        'token',
        'newPassword'
      );
    });
  });

  describe('requestPasswordReset', () => {
    it('should return an AccountsError', async () => {
      const error = 'something bad';
      Accounts.config(
        {},
        {
          ...mockTransport,
          sendResetPasswordEmail: () => Promise.reject({ message: error }),
        }
      );
      try {
        await Accounts.requestPasswordReset('email@g.co');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(error);
      }
    });

    it('should call transport.sendResetPasswordEmail', async () => {
      Accounts.config({}, mockTransport);
      await Accounts.requestPasswordReset('email@g.co');
      expect(mockTransport.sendResetPasswordEmail).toHaveBeenCalledTimes(1);
      expect(mockTransport.sendResetPasswordEmail).toHaveBeenCalledWith(
        'email@g.co'
      );
    });

    it('should throw if an invalid email is provided', async () => {
      Accounts.config({}, mockTransport);
      try {
        await Accounts.requestPasswordReset('email');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Valid email must be provided');
        expect(mockTransport.sendResetPasswordEmail).not.toHaveBeenCalled();
      }
    });
  });

  describe('requestVerificationEmail', () => {
    it('should return an AccountsError', async () => {
      const error = 'something bad';
      Accounts.config(
        {},
        {
          ...mockTransport,
          sendVerificationEmail: () => Promise.reject({ message: error }),
        }
      );
      try {
        await Accounts.requestVerificationEmail('email@g.co');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(error);
      }
    });

    it('should call transport.sendVerificationEmail', async () => {
      Accounts.config({}, mockTransport);
      await Accounts.requestVerificationEmail('email@g.co');
      expect(mockTransport.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mockTransport.sendVerificationEmail).toHaveBeenCalledWith(
        'email@g.co'
      );
    });

    it('should throw if an invalid email is provided', async () => {
      Accounts.config({}, mockTransport);
      try {
        await Accounts.requestVerificationEmail('email');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Valid email must be provided');
        expect(mockTransport.sendVerificationEmail).not.toHaveBeenCalled();
      }
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
      await Accounts.loginWithPassword('username', 'password');

      const result = await Accounts.impersonate('impUser');
      const tokens = Accounts.tokens();
      expect(tokens).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
      expect(Accounts.user()).toEqual(impersonateResult.user);
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
      await Accounts.loginWithPassword('username', 'password');
      Accounts.instance.storeTokens = jest.fn();
      await Accounts.impersonate('impUser');
      expect(Accounts.instance.storeTokens).toHaveBeenCalledTimes(1);
    });

    it('should not save persist impersonation when persistImpersonation=false', async () => {
      await Accounts.config(
        { history, persistImpersonation: false },
        mockTransport
      );
      await Accounts.loginWithPassword('username', 'password');
      Accounts.instance.storeTokens = jest.fn();
      await Accounts.impersonate('impUser');
      expect(Accounts.instance.storeTokens).not.toHaveBeenCalled();
    });
  });

  describe('stopImpersonation', () => {
    it('should not replace tokens if not impersonating', async () => {
      await Accounts.config({ history }, mockTransport);

      await Accounts.loginWithPassword('username', 'password');

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

      await Accounts.loginWithPassword('username', 'password');
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
