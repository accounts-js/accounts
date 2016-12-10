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

let accounts;
describe('Accounts', () => {
  describe('createUser', () => {
    beforeEach(() => {
      accounts = new Accounts({
        createUser: () => Promise.resolve(true),
      });
    });
    it('requires password', async () => {
      try {
        await accounts.createUser({
          password: null,
        });
      } catch (err) {
        expect(err).to.eql(new Error('Password is required'));
      }
    });
    it('requires username or an email', async () => {
      try {
        await accounts.createUser({
          password: '123456',
          username: '',
          email: '',
        });
      } catch (err) {
        expect(err).to.eql(Error('Username or Email is required'));
      }
    });
    it('calls callback on succesfull user creation', async () => {
      const callback = sinon.spy();
      await accounts.createUser({
        password: '123456',
        username: 'user',
      }, callback);

      expect(callback).to.have.been.called;
    });
    it('calls callback on failure with error message', async () => {
      const client = {
        createUser: () => Promise.reject('error'),
      };

      accounts = new Accounts(client);

      const callback = sinon.spy();

      try {
        await accounts.createUser({
          password: '123456',
          username: 'user',
        }, callback);
      } catch (err) {
        expect(callback).to.have.been.calledWith('error');
      }
    });
  });
});
