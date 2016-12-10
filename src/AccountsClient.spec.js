/* eslint-disable no-unused-expressions */
import 'regenerator-runtime/runtime'; // For async / await syntax
import chai, { expect } from 'chai';
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
      accounts = new Accounts();
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
  });
});
