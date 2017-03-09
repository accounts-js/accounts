import { Map } from 'immutable';
// import { generateAccessToken, generateRefreshToken } from '@accounts/server';
import './mockLocalStorage';
import Accounts from './AccountsClient';

const loggedInUser = {
  user: {
    id: '123',
    username: 'test',
    email: 'test@test.com',
  },
  tokens: {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  },
};

// Mock history object passed to AccountsClient.config
const history = {
  push() {

  },
};

global.onload = () => {

};

describe('Accounts', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });
  describe('config', () => {
    it('requires a transport', () => {
      try {
        Accounts.config({
          history,
        });
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('A REST or GraphQL transport is required');
      }
    });
    it('sets the transport', () => {
      const transport = {};
      Accounts.config({
        history,
      }, transport);
      expect(Accounts.instance.transport).toEqual(transport);
    });
  });
  describe('createUser', () => {
    it('requires user object', async () => {
      Accounts.config({
        history,
      }, {
        createUser: Promise.resolve(),
      });
      try {
        await Accounts.createUser();
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for create user request');
      }
    });
    it('requires password', async () => {
      Accounts.config({
        history,
      }, {
        createUser: Promise.resolve(),
      });
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
      Accounts.config({ history }, {
        createUser: Promise.resolve(),
      });
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
    it('calls callback on succesfull user creation', async () => {
      const callback = jest.fn();
      const transport = {
        createUser: () => Promise.resolve(),
        loginWithPassword: () => Promise.resolve(loggedInUser),
      };
      Accounts.config({ history }, transport);
      await Accounts.createUser({
        password: '123456',
        username: 'user',
      }, callback);

      expect(callback.mock.calls.length).toEqual(1);
    });
    it('calls callback on failure with error message', async () => {
      const transport = {
        createUser: () => Promise.reject('error message'),
      };

      Accounts.config({ history }, transport);

      const callback = jest.fn();

      try {
        await Accounts.createUser({
          password: '123456',
          username: 'user',
        }, callback);
        throw new Error();
      } catch (err) {
        expect(callback.mock.calls.length).toEqual(1);
        expect(callback.mock.calls[0][0]).toEqual('error message');
      }
    });
    it('calls login function with user id and password of created user', async () => {
      const transport = {
        createUser: () => Promise.resolve('123'),
      };
      Accounts.config({ history }, transport);

      Accounts.instance.loginWithPassword = jest.fn(() => Accounts.instance.loginWithPassword);

      await Accounts.createUser({
        password: '123456',
        username: 'user',
      });

      expect(Accounts.instance.loginWithPassword.mock.calls[0][0]).toEqual({ id: '123' });
      expect(Accounts.instance.loginWithPassword.mock.calls[0][1]).toEqual('123456');
    });
  });
  describe('loginWithPassword', () => {
    it('throws error if password is undefined', async () => {
      const transport = {
        loginWithPassword: () => Promise.resolve(),
      };
      Accounts.config({ history }, transport);
      try {
        await Accounts.loginWithPassword();
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for login request');
      }
    });
    it('throws error if user is undefined', async () => {
      const transport = {
        loginWithPassword: () => Promise.resolve(),
      };
      Accounts.config({ history }, transport);
      try {
        await Accounts.loginWithPassword();
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Unrecognized options for login request');
      }
    });
    it('throws error user is not a string or is an empty object', async () => {
      const transport = {
        loginWithPassword: () => Promise.resolve(),
      };
      Accounts.config({ history }, transport);
      try {
        await Accounts.loginWithPassword({}, 'password');
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Match failed');
      }
    });
    it('throws error password is not a string', async () => {
      const transport = {
        loginWithPassword: () => Promise.resolve(),
      };
      Accounts.config({ history }, transport);
      try {
        await Accounts.loginWithPassword({ user: 'username' }, {});
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('Match failed');
      }
    });
    it('calls callback on successful login', async () => {
      const transport = {
        loginWithPassword: () => Promise.resolve(loggedInUser),
      };
      Accounts.config({ history }, transport);
      const callback = jest.fn();
      await Accounts.loginWithPassword('username', 'password', callback);
      expect(callback.mock.calls.length).toEqual(1);
      expect(Accounts.loggingIn()).toBe(false);
    });
    it('calls transport', async () => {
      const loginWithPassword = jest.fn(() => Promise.resolve(loggedInUser));
      const transport = {
        loginWithPassword,
      };
      Accounts.config({ history }, transport);
      await Accounts.loginWithPassword('username', 'password');
      expect(loginWithPassword.mock.calls[0][0]).toEqual('username');
      expect(loginWithPassword.mock.calls[0][1]).toEqual('password');
      expect(loginWithPassword.mock.calls.length).toEqual(1);
    });
    it('calls callback with error on failed login', async () => {
      const transport = {
        loginWithPassword: () => Promise.reject('error'),
      };
      Accounts.config({ history }, transport);
      const callback = jest.fn();
      try {
        await Accounts.loginWithPassword('username', 'password', callback);
        throw new Error();
      } catch (err) {
        expect(callback.mock.calls.length).toEqual(1);
        expect(callback.mock.calls[0][0]).toEqual('error');
      }
    });
    it('sets loggingIn flag to false on failed login', async () => {
      const transport = {
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
      const transport = {
        loginWithPassword: () => Promise.resolve(loggedInUser),
      };
      Accounts.config({ history }, transport);
      await Accounts.loginWithPassword('username', 'password');
      expect(localStorage.getItem('accounts:accessToken')).toEqual('accessToken');
      expect(localStorage.getItem('accounts:refreshToken')).toEqual('refreshToken');
    });

    it('fetch tokens from storage when storage is async', async () => {
      const transport = {
        loginWithPassword: () => Promise.resolve(loggedInUser),
      };

      Accounts.config({
        history,
        tokenStorage: {
          getItem: () => Promise.resolve('testValue'),
        },
      }, transport);

      const tokens = await Accounts.tokens();
      expect(tokens.accessToken).toBe('testValue');
      expect(tokens.refreshToken).toBe('testValue');
    });

    it('fetch tokens from storage when storage is sync', async () => {
      const transport = {
        loginWithPassword: () => Promise.resolve(loggedInUser),
      };

      Accounts.config({
        history,
        tokenStorage: {
          getItem: () => 'testValue',
        },
      }, transport);

      const tokens = await Accounts.tokens();
      expect(tokens.accessToken).toBe('testValue');
      expect(tokens.refreshToken).toBe('testValue');
    });

    it('stores user in redux', async () => {
      const transport = {
        loginWithPassword: () => Promise.resolve(loggedInUser),
      };
      Accounts.config({ history }, transport);
      await Accounts.loginWithPassword('username', 'password');
      expect(Accounts.instance.getState().get('user')).toEqual(Map({
        ...loggedInUser.user,
      }));
    });
    it('stores tokens in redux', async () => {
      const transport = {
        loginWithPassword: () => Promise.resolve(loggedInUser),
      };
      Accounts.config({ history }, transport);
      await Accounts.loginWithPassword('username', 'password');
      expect(Accounts.instance.getState().get('tokens')).toEqual(Map({
        ...loggedInUser.tokens,
      }));
    });
  });
  describe('logout', () => {
    it('calls callback on successful logout', async () => {
      const transport = {
        logout: () => Promise.resolve(),
      };
      Accounts.config({ history }, transport);
      const callback = jest.fn();
      await Accounts.logout(callback);
      expect(callback.mock.calls.length).toEqual(1);
    });
    it('calls onLogout on successful logout', async () => {
      const onSignedOutHook = jest.fn();
      const transport = {
        logout: () => Promise.resolve(),
      };
      Accounts.config({ history, onSignedOutHook }, transport);
      await Accounts.logout();
      expect(onSignedOutHook.mock.calls.length).toEqual(1);
    });

    it('calls callback on failure with error message', async () => {
      const transport = {
        logout: () => Promise.reject({ message: 'error message' }),
      };
      Accounts.instance.storeTokens({ tokens: { accessToken: '1' } });
      Accounts.config({ history }, transport);
      const callback = jest.fn();
      try {
        await Accounts.logout(callback);
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('error message');
        expect(callback.mock.calls.length).toEqual(1);
        expect(callback.mock.calls[0][0]).toEqual({ message: 'error message' });
      }
    });

    it('clear tokens in redux', async () => {
      const transport = {
        logout: () => Promise.reject({ message: 'error message' }),
      };
      Accounts.instance.storeTokens({ tokens: { accessToken: '1' } });
      Accounts.config({ history }, transport);
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
        logout: () => Promise.reject({ message: 'error message' }),
      };
      Accounts.instance.storeTokens({ tokens: { accessToken: '1' } });
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
      Accounts.config({}, {});
      Accounts.instance.clearTokens = jest.fn(() => Accounts.instance.clearTokens);
      Accounts.instance.clearUser = jest.fn(() => Accounts.instance.clearUser);
      try {
        await Accounts.refreshSession();
      } catch (err) {
        expect(err.message).toEqual('no tokens provided');
        expect(Accounts.instance.clearTokens.mock.calls.length).toEqual(1);
        expect(Accounts.instance.clearUser.mock.calls.length).toEqual(1);
      }
    });
    it('clears tokens, users and throws error if bad refresh token provided', async () => {
      Accounts.config({}, {});
      localStorage.setItem('accounts:refreshToken', 'bad token');
      localStorage.setItem('accounts:accessToken', 'bad token');
      Accounts.instance.clearTokens = jest.fn(() => Accounts.instance.clearTokens);
      Accounts.instance.clearUser = jest.fn(() => Accounts.instance.clearUser);
      try {
        await Accounts.refreshSession();
        throw new Error();
      } catch (err) {
        const { message } = err;
        expect(message).toEqual('falsy token provided');
      }
    });
    // it('requests a new token pair, sets the tokens and the user', async () => {
    //   Accounts.config({}, {
    //     refreshTokens: () => Promise.resolve({
    //       user: {
    //         username: 'username',
    //       },
    //       tokens: {
    //         accessToken: 'newAccessToken',
    //         refreshToken: 'newRefreshToken',
    //       },
    //     }),
    //   });
    //   const secret = 'secret';
    //   const user = {
    //     id: '123',
    //   };
    //   const accessToken = generateAccessToken({
    //     data: {
    //       user,
    //     },
    //     secret,
    //   });
    //   const refreshToken = generateRefreshToken({
    //     secret,
    //   });
    //   localStorage.setItem('accounts:accessToken', accessToken);
    //   localStorage.setItem('accounts:refreshToken', refreshToken);
    //   await Accounts.refreshSession();
    //   expect(localStorage.getItem('accounts:accessToken')).toEqual('newAccessToken');
    //   expect(localStorage.getItem('accounts:refreshToken')).toEqual('newRefreshToken');
    //   expect(Accounts.user()).toEqual({
    //     username: 'username',
    //   });
    // });
  });

  describe('verifyEmail', () => {
    it('should return an AccountsError', async () => {
      const error = 'something bad';
      Accounts.config({}, { verifyEmail: () => Promise.reject({ message: error }) });
      try {
        await Accounts.verifyEmail();
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(error);
      }
    });

    it('should call transport.verifyEmail', async () => {
      const mock = jest.fn(() => Promise.resolve());
      Accounts.config({}, { verifyEmail: mock });
      await Accounts.verifyEmail('token');
      expect(mock.mock.calls.length).toEqual(1);
      expect(mock.mock.calls[0][0]).toEqual('token');
    });
  });

  describe('resetPassword', () => {
    it('should return an AccountsError', async () => {
      const error = 'something bad';
      Accounts.config({}, { resetPassword: () => Promise.reject({ message: error }) });
      try {
        await Accounts.resetPassword();
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(error);
      }
    });

    it('should call transport.resetPassword', async () => {
      const mock = jest.fn(() => Promise.resolve());
      Accounts.config({}, { resetPassword: mock });
      await Accounts.resetPassword('token', 'newPassword');
      expect(mock.mock.calls.length).toEqual(1);
      expect(mock.mock.calls[0][0]).toEqual('token');
      expect(mock.mock.calls[0][1]).toEqual('newPassword');
    });
  });

  describe('requestPasswordReset', () => {
    it('should return an AccountsError', async () => {
      const error = 'something bad';
      Accounts.config({}, { sendResetPasswordEmail: () => Promise.reject({ message: error }) });
      try {
        await Accounts.requestPasswordReset('email@g.co');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(error);
      }
    });

    it('should call transport.sendResetPasswordEmail', async () => {
      const mock = jest.fn(() => Promise.resolve());
      Accounts.config({}, { sendResetPasswordEmail: mock });
      await Accounts.requestPasswordReset('email@g.co');
      expect(mock.mock.calls.length).toEqual(1);
      expect(mock.mock.calls[0][0]).toEqual('email@g.co');
    });

    it('should throw if an invalid email is provided', async () => {
      const mock = jest.fn();
      Accounts.config({}, { sendResetPasswordEmail: mock });
      try {
        await Accounts.requestPasswordReset('email');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Valid email must be provided');
        expect(mock.mock.calls.length).toEqual(0);
      }
    });
  });

  describe('requestVerificationEmail', () => {
    it('should return an AccountsError', async () => {
      const error = 'something bad';
      Accounts.config({}, { sendVerificationEmail: () => Promise.reject({ message: error }) });
      try {
        await Accounts.requestVerificationEmail('email@g.co');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual(error);
      }
    });

    it('should call transport.sendVerificationEmail', async () => {
      const mock = jest.fn(() => Promise.resolve());
      Accounts.config({}, { sendVerificationEmail: mock });
      await Accounts.requestVerificationEmail('email@g.co');
      expect(mock.mock.calls.length).toEqual(1);
      expect(mock.mock.calls[0][0]).toEqual('email@g.co');
    });

    it('should throw if an invalid email is provided', async () => {
      const mock = jest.fn();
      Accounts.config({}, { sendVerificationEmail: mock });
      try {
        await Accounts.requestVerificationEmail('email');
        throw new Error();
      } catch (err) {
        expect(err.message).toEqual('Valid email must be provided');
        expect(mock.mock.calls.length).toEqual(0);
      }
    });
  });
});
