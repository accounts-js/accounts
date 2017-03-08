// @flow

import { config as sharedConfig } from '@accounts/common';
import type { AccountsCommonConfiguration, PasswordLoginUserType, SessionType, UserObjectType } from '@accounts/common';

export type PasswordAuthenticator = (user: PasswordLoginUserType, password: string) => Promise<any>;
export type ResumeSessionValidator = (user: UserObjectType, session: SessionType) => Promise<any>;

type TokenExpiration = string;
export type TokenConfig = {
  accessToken?: {
    expiresIn?: TokenExpiration
  },
  refreshToken?: {
    expiresIn?: TokenExpiration
  }
};

export type AccountsServerConfiguration = AccountsCommonConfiguration & {
  tokenSecret?: string,
  tokenConfigs?: TokenConfig,
  passwordAuthenticator?: PasswordAuthenticator,
  resumeSessionValidator?: ResumeSessionValidator
};

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
