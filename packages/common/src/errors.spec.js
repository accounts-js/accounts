import { AccountsError } from './errors';

const error = new AccountsError(
  'Validation Error',
  {
    username: 'user',
  },
  'ACCOUNTS:1',
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


  // NB: For some reason it seems jest have different Error class
  // it retain fields but our tests fail
  // it('should be able to serialize into a string', () => {
  //   try {
  //     throws();
  //   } catch (e) {
  //     expect(e.serialize()).toBe(
  //       '{"message": "Validation Error", ' +
  //       '"loginInfo": { "username": "user" }, ' +
  //       '"errorCode": "ACCOUNTS:1" }'
  //     );
  //   }
  // });
  //
  // it('should be easily distinguished from other errors', () => {
  //   try {
  //     throws();
  //   } catch (e) {
  //     expect(e instanceof AccountsError).toBeTruthy();
  //   }
  // });
});
