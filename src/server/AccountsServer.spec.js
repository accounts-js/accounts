import Accounts from './AccountsServer';

describe('Accounts', () => {
  beforeEach(() => {
    Accounts.config({}, {});
  });
  describe('config', () => {
    beforeEach(() => {
    });
    it('requires a db driver', () => {
      try {
        Accounts.config();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('A database driver is required');
      }
    });
    it('sets the db driver', () => {
      const db = {};
      Accounts.config({}, db);
      expect(Accounts.instance.db).toEqual(db);
    });
  });
  describe('createUser', () => {
    const db = {
      findUserByUsername: () => Promise.resolve(),
      findUserByEmail: () => Promise.resolve(),
      createUser: () => Promise.resolve(),
    };
    beforeEach(() => {
      Accounts.config({}, db);
    });
    it('requires username or an email', async () => {
      try {
        await Accounts.createUser({
          password: '123456',
          username: '',
          email: '',
        });
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Username or Email is required');
      }
    });
    it('throws error if username exists', async () => {
      Accounts.config({}, {
        ...db,
        findUserByUsername: () => Promise.resolve('user'),
      });
      try {
        await Accounts.createUser({
          password: '123456',
          username: 'user1',
          email: '',
        });
        expect.fail();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Username already exists');
      }
    });
    it('throws error if email exists', async () => {
      Accounts.config({}, {
        ...db,
        findUserByEmail: () => Promise.resolve('user'),
      });
      try {
        await Accounts.createUser({
          password: '123456',
          username: '',
          email: 'email1',
        });
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Email already exists');
      }
    });
    it('succesfully create a user', async () => {
      Accounts.config({}, {
        ...db,
        createUser: () => Promise.resolve('123'),
      });
      const userId = await Accounts.createUser({
        password: '123456',
        username: 'user1',
      });
      expect(userId).toEqual('123');
    });
  });
  describe('loginWithPassword', () => {
    it('throws error if user is undefined', async () => {
      try {
        await Accounts.loginWithPassword(null, '123456');
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Unrecognized options for login request [400]');
      }
    });
    it('throws error if password is undefined', async () => {
      try {
        await Accounts.loginWithPassword('username', null);
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Unrecognized options for login request [400]');
      }
    });
    it('throws error if user is not a string', async () => {
      try {
        await Accounts.loginWithPassword({}, '123456');
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Match failed [400]');
      }
    });
    it('throws error if password is not a string', async () => {
      try {
        await Accounts.loginWithPassword('username', {});
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Match failed [400]');
      }
    });
    it('throws error if user is not found', async () => {
      Accounts.config({}, {
        findUserByUsername: () => Promise.resolve(null),
        findUserByEmail: () => Promise.resolve(null),
      });
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('User not found [403]');
      }
    });
    it('throws error if password not set', async () => {
      Accounts.config({}, {
        findUserByUsername: () => Promise.resolve('123'),
        findUserByEmail: () => Promise.resolve(null),
        findPasswordHash: () => Promise.resolve(null),
      });
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('User has no password set [403]');
      }
    });
    it('throws error if password is incorrect', async () => {
      Accounts.config({}, {
        findUserByUsername: () => Promise.resolve('123'),
        findUserByEmail: () => Promise.resolve(null),
        findPasswordHash: () => Promise.resolve('hash'),
        verifyPassword: () => Promise.resolve(false),
      });
      try {
        await Accounts.loginWithPassword('username', '123456');
        throw new Error();
      } catch (err) {
        const { message } = err.serialize();
        expect(message).toEqual('Incorrect password [403]');
      }
    });
  });
});
