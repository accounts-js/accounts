/* eslint-disable no-unused-expressions */
import 'regenerator-runtime/runtime'; // For async / await syntax
import chai, { expect } from 'chai';
// import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
// import 'localstorage-polyfill';
import Accounts from './AccountsServer';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Accounts', () => {
  describe('config', () => {
    beforeEach(() => {
    });
    it('requires a db driver', () => {
      expect(() => Accounts.config()).to.throw('A database driver is required');
    });
    it('sets the db driver', () => {
      const db = {};
      Accounts.config({}, db);
      expect(Accounts.instance.db).to.equal(db);
    });
  });
});
