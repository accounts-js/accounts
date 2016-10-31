/* eslint-disable no-unused-expressions */

import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import Accounts from './index';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Accounts', () => {
  it('throws error on invalid keys', () => {
    () => Accounts.ui.config({
      'bad key': 'bad value',
    }).should.throw.error;
  });
  it('redirect hooks must be strings or functions', () => {
    () => Accounts.ui.config({
      onSignedInHook: () => null,
    }).should.be.ok;
    () => Accounts.ui.config({
      onSignedInHook: '',
    }).should.be.ok;
    () => Accounts.ui.config({
      onSignedInHook: {},
    }).should.throw.error;
  });
});
