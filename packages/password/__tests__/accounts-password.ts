import { AccountsPassword } from '../src';

describe('AccountsPassword', () => {
  describe('config', () => {
    it('should have default options', async () => {
      const password = new AccountsPassword({});
      expect(password.options.passwordResetTokenExpirationInDays).toBe(3);
    });
  });
});
