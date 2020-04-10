import AccountsOAuthTwitter from '../src';

describe('AccountsOAuthTwitter', () => {
  it('should have default export AccountsOAuthTwitter', () => {
    expect(typeof AccountsOAuthTwitter).toBe('function');
  });

  describe('configuration', () => {
    const twitterProvider = new AccountsOAuthTwitter({
      key: 'TWITTER_KEY',
      secret: 'TWITTER_SECRET',
      getRegistrationPayload: async oauthUser => ({
        email: oauthUser.email,
        name: oauthUser.username,
      }),
    });

    it('should allow providing function for getting custom payload for user registration', async () => {
      const twitterExampleUser = {
        id: '123',
        username: 'twitteruser',
        email: 'twitteruser@t.co',
      };

      expect(twitterProvider.getRegistrationPayload).not.toBeUndefined();

      const userToRegister = await twitterProvider.getRegistrationPayload!(twitterExampleUser);

      expect(userToRegister.email).toBe('twitteruser@t.co');
      expect(userToRegister.name).toBe('twitteruser');
    });
  });
});
