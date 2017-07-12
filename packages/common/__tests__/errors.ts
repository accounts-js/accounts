import { AccountsError } from '../src/errors';

const error = new AccountsError(
  'Validation Error',
  {
    username: 'user',
  },
  'ACCOUNTS:1'
);

const throws = () => {
  throw error;
};

describe('AccountsError class', () => {
  it('should be throwable', () => expect(throws).toThrow());

  it('should carry relevant info', () => {
    try {
      throws();
    } catch (e) {
      expect(e.message).toBe('Validation Error');
      expect(e.loginInfo).toMatchObject({ username: 'user' });
      expect(e.errorCode).toBe('ACCOUNTS:1');
      expect(e.epochTime).toBeDefined();
    }
  });

  it('should be able to serialize into a string', () => {
    try {
      throws();
    } catch (e) {
      expect(e.serialize()).toBe(
        '{"message":"Validation Error",' +
          '"loginInfo":{"username":"user"},' +
          '"errorCode":"ACCOUNTS:1",' +
          '"epochTime":' +
          e.epochTime +
          '}'
      );
    }
  });

  it('should be easily distinguished from other errors', () => {
    expect(throws).toThrowError(AccountsError);
  });
});
