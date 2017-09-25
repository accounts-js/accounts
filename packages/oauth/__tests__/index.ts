import { AccountsOauth } from '../src';

describe('AccountsOauth', () => {
  describe('authenticate', () => {
    const config = {};

    it('should throw invalid provider', async () => {
      const oauth = new AccountsOauth(config);
      try {
        await oauth.authenticate({
          provider: 'facebook',
        });
      } catch (err) {
        expect(err.message).toBe('Invalid provider');
      }
    });
  });
});
