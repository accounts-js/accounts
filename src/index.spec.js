import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from "chai-as-promised";

import Accounts from './index';

const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('graphql-accounts', () => {

  it('sets foo', () => {
    const accounts = new Accounts();
    accounts.foo.should.be.true;
  });

});
