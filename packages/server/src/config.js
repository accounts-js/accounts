import { config as sharedConfig } from '@accounts/common';

export default {
  ...sharedConfig,
  tokenSecret: 'terrible secret',
  tokenConfigs: {
    accessToken: {
      expiresIn: '90m',
    },
    refreshToken: {
      expiresIn: '1d',
    },
  },
  // TODO Investigate oauthSecretKey
  // oauthSecretKey
};
