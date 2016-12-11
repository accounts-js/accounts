/* eslint-disable no-unused-expressions */
import 'regenerator-runtime/runtime'; // For async / await syntax
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
// import 'localstorage-polyfill';
import Accounts from './AccountsClient';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Accounts', () => {
  describe('config', () => {
    it('requires a client', () => {
      expect(() => Accounts.config().to.throw('A REST or GraphQL client is required'));
    });
    it('sets the client', () => {
      const client = {};
      Accounts.config({}, client);
      expect(Accounts.instance.client).to.equal(client);
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
        expect(message).to.eql('Password is required');
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
        expect(message).to.eql('Username or Email is required');
      }
    });
    it('calls callback on succesfull user creation', async () => {
      const callback = sinon.spy();
      const client = {
        createUser: () => Promise.resolve(true),
      };
      Accounts.config({}, client);
      await Accounts.createUser({
        password: '123456',
        username: 'user',
      }, callback);

      expect(callback).to.have.been.called;
    });
    it('calls callback on failure with error message', async () => {
      const client = {
        createUser: () => Promise.reject('error message'),
      };

      Accounts.config({}, client);

      const callback = sinon.spy();

      try {
        await Accounts.createUser({
          password: '123456',
          username: 'user',
        }, callback);
      } catch (err) {
        expect(callback).to.have.been.calledWith('error message');
      }
    });
  });
});
