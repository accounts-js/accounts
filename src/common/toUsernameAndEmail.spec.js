import { expect } from 'chai';
import toUsernameAndEmail from './toUsernameAndEmail';

describe('toUsernameAndEmail', () => {
  it('username', () => {
    expect(toUsernameAndEmail({ user: 'UserA' })).to.deep.equal({
      username: 'UserA',
      email: null,
    });
  });
  it('email', () => {
    expect(toUsernameAndEmail({ user: 'UserA@users.com' })).to.deep.equal({
      username: null,
      email: 'UserA@users.com',
    });
  });
  it('username and email', () => {
    expect(toUsernameAndEmail({
      user: null, username: 'UserA', email: 'UserA@users.com',
    })).to.deep.equal({
      username: 'UserA',
      email: 'UserA@users.com',
    });
  });
});
