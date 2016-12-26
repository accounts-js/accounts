// import 'localstorage-polyfill';
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
        expect.fail();
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
        expect.fail();
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
});
