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

const instagramProvider = new AccountsOAuthInstagram();

const params = { access_token: 'test' };

describe('AccountsOAuthInstagram', () => {
  describe('authenticate', () => {
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
});
