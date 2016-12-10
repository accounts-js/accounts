/* eslint-disable no-unused-expressions */
import 'regenerator-runtime/runtime'; // For async / await syntax
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
// import 'localstorage-polyfill';
import Accounts from './Accounts';
import createStore from './createStore';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Accounts', () => {
  beforeEach(() => {
    Accounts.store = createStore({
      reducers: {
        accounts: Accounts.reducer,
      },
    });
  });
  it('dummy test', () => {

  });
});
