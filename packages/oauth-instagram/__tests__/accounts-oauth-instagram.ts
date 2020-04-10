/* eslint-disable @typescript-eslint/camelcase */
import rp from 'request-promise';

import AccountsOAuthInstagram from '../src';

// Mock the requestPromise module

jest.mock('request-promise');

const rpResult = JSON.stringify({
  data: {
    id: 'id',
    username: 'username',
    profile_picture: 'profile_picture',
    access_token: 'access_token',
  },
});

(rp as any).mockResolvedValue(rpResult);

const params = { access_token: 'test' };

describe('AccountsOAuthInstagram', () => {
  describe('authenticate', () => {
    const instagramProvider = new AccountsOAuthInstagram();
    instagramProvider.authenticate(params);
    it('should call rp', () => {
      expect(rp).toHaveBeenCalled();
    });

    it('should return the user data', () => {
      return instagramProvider.authenticate(params).then(result => {
        expect(result).toMatchObject({
          id: 'id',
          username: 'username',
          profilePicture: 'profile_picture',
          accessToken: 'test',
        });
      });
    });
  });

  describe('configuration', () => {
    const instagramProvider = new AccountsOAuthInstagram({
      getRegistrationPayload: async oauthUser => ({
        email: oauthUser.email,
        instagramUsername: oauthUser.username,
      }),
    });

    it('should allow providing function for getting custom payload for user registration', async () => {
      const instagramExampleUser = {
        id: '1574083',
        username: 'snoopdogg',
        email: 'snoopdogg@rap.rules',
        full_name: 'Snoop Dogg',
        profile_picture: 'https://www.instagram.com/somepicture.png',
      };

      expect(instagramProvider.getRegistrationPayload).not.toBeUndefined();

      const userToRegister = await instagramProvider.getRegistrationPayload!(instagramExampleUser);

      expect(userToRegister.email).toBe('snoopdogg@rap.rules');
      expect(userToRegister.instagramUsername).toBe('snoopdogg');
    });
  });
});
