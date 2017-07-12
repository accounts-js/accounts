import toUsernameAndEmail from '../src/toUsernameAndEmail';

describe('toUsernameAndEmail', () => {
  it('username', () => {
    expect(toUsernameAndEmail({ user: 'UserA' })).toEqual({
      username: 'UserA',
      email: null,
    });
  });
  it('email', () => {
    expect(toUsernameAndEmail({ user: 'UserA@users.com' })).toEqual({
      username: null,
      email: 'UserA@users.com',
    });
  });
  it('username and email', () => {
    expect(
      toUsernameAndEmail({
        user: null,
        username: 'UserA',
        email: 'UserA@users.com',
      })
    ).toEqual({
      username: 'UserA',
      email: 'UserA@users.com',
    });
  });
});
