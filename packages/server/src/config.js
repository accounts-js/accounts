// @flow

import { config as sharedConfig } from '@accounts/common';
import type { AccountsCommonConfiguration, PasswordLoginUserType, SessionType, UserObjectType, PasswordType } from '@accounts/common';
import type { EmailTemplateType } from './emailTemplates';

// eslint-disable-next-line max-len
export type PasswordAuthenticator = (user: PasswordLoginUserType, password: PasswordType) => Promise<any>;
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
export type UserObjectSanitizerFunction =
  (userObject: UserObjectType, omitFunction: Function, pickFunction: Function) => any;
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
  email?: Object,
  emailTokensExpiry?: number,
  impersonationAuthorize: (user: UserObjectType, impersonateToUser: UserObjectType) => Promise<any>,
  validateNewUser?: (user: UserObjectType) => Promise<boolean>,
  userObjectSanitizer?: UserObjectSanitizerFunction,
  allowedLoginFields?: string[]
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
  userObjectSanitizer: (user: UserObjectType) => user,
  allowedLoginFields: ['id', 'email', 'username'],
  emailTokensExpiry: 1000 * 3600, // 1 hour in milis
  // TODO Investigate oauthSecretKey
  // oauthSecretKey
};
