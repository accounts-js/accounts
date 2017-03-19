// @flow

import { config as sharedConfig } from '@accounts/common';
import type { AccountsCommonConfiguration, PasswordLoginUserType, SessionType, UserObjectType } from '@accounts/common';
import type { EmailTemplateType } from './emailTemplates';

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

type EmailType = EmailTemplateType & { to: string };
export type SendMailFunction = (emailConfig: EmailType | Object) => Promise<void>;
// eslint-disable-next-line max-len
export type PrepareMailFunction = (to: string, token: string, user: UserObjectType, pathFragment: string, emailTemplate: EmailTemplateType, from: string) => Object;

export type AccountsServerConfiguration = AccountsCommonConfiguration & {
  tokenSecret?: string,
  tokenConfigs?: TokenConfig,
  passwordAuthenticator?: PasswordAuthenticator,
  resumeSessionValidator?: ResumeSessionValidator,
  prepareMail?: PrepareMailFunction,
  sendMail?: SendMailFunction,
  // https://github.com/eleith/emailjs#emailserverconnectoptions
  email?: Object
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
