// import 'localstorage-polyfill';
import Accounts from './AccountsClient';

describe('Accounts', () => {
  describe('config', () => {
    it('requires a client', () => {
      try {
        Accounts.config();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('A REST or GraphQL client is required');
      }
    });
    it('sets the client', () => {
      const client = {};
      Accounts.config({}, client);
      expect(Accounts.instance.client).toEqual(client);
    });
  });
  describe('createUser', () => {
    it('requires password', async () => {
      try {
        await Accounts.createUser({
          password: null,
        });
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Password is required');
      }
    });
    it('requires username or an email', async () => {
      try {
        await Accounts.createUser({
          password: '123456',
          username: '',
          email: '',
        });
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Username or Email is required');
      }
    });
    it('calls callback on succesfull user creation', async () => {
      const callback = jest.fn();
      const client = {
        createUser: () => Promise.resolve(true),
      };
      Accounts.config({}, client);
      await Accounts.createUser({
        password: '123456',
        username: 'user',
      }, callback);

      expect(callback.mock.calls.length).toEqual(1);
    });
    it('calls callback on failure with error message', async () => {
      const client = {
        createUser: () => Promise.reject('error message'),
      };

      Accounts.config({}, client);

      const callback = jest.fn();

      try {
        await Accounts.createUser({
          password: '123456',
          username: 'user',
        }, callback);
      } catch (err) {
        expect(callback.mock.calls.length).toEqual(1);
        expect(callback.mock.calls[0][0]).toEqual('error message');
      }
    });
  });
  describe('loginWithPassword', () => {
    it('throws error if password is undefined', async () => {
      const client = {
        loginWithPassword: () => Promise.resolve(),
      };
      Accounts.config({}, client);
      try {
        await Accounts.loginWithPassword();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Unrecognized options for login request [400]');
      }
    });
    it('throws error if user is undefined', async () => {
      const client = {
        loginWithPassword: () => Promise.resolve(),
      };
      Accounts.config({}, client);
      try {
        await Accounts.loginWithPassword();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Unrecognized options for login request [400]');
      }
    });
    it('throws error user is not a string or is an empty object', async () => {
      const client = {
        loginWithPassword: () => Promise.resolve(),
      };
      Accounts.config({}, client);
      try {
        await Accounts.loginWithPassword({}, 'password');
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Match failed [400]');
      }
    });
    it('throws error password is not a string', async () => {
      const client = {
        loginWithPassword: () => Promise.resolve(),
      };
      Accounts.config({}, client);
      try {
        await Accounts.loginWithPassword({ user: 'username' }, {});
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Match failed [400]');
      }
    });
    it('calls callback on successful login', async () => {
      const client = {
        loginWithPassword: () => Promise.resolve(),
      };
      Accounts.config({}, client);
      const callback = jest.fn();
      await Accounts.loginWithPassword('username', 'password', callback);
      expect(callback.mock.calls.length).toEqual(1);
    });
    it('calls callback with error on failed login', async () => {
      const client = {
        loginWithPassword: () => Promise.reject('error'),
      };
      Accounts.config({}, client);
      const callback = jest.fn();
      try {
        await Accounts.loginWithPassword('username', 'password', callback);
      } catch (err) {
        expect(callback.mock.calls.length).toEqual(1);
        expect(callback.mock.calls[0][0]).toEqual('error');
      }
    });
  });
});
