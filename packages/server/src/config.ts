import {
  AccountsCommonConfiguration,
  PasswordLoginUserType,
  SessionType,
  UserObjectType,
  PasswordType,
  CreateUserType,
  config as sharedConfig,
  PasswordSignupFields,
} from '@accounts/common';
import { EmailTemplateType } from './email-templates';

export type PasswordAuthenticator = (
  user: PasswordLoginUserType,
  password: PasswordType
) => Promise<any>;
export type ResumeSessionValidator = (
  user: UserObjectType,
  session: SessionType
) => Promise<any>;

export type TokenExpiration = string;
export interface TokenConfig {
  accessToken?: {
    expiresIn?: TokenExpiration;
  };
  refreshToken?: {
    expiresIn?: TokenExpiration;
  };
}

export type EmailType = EmailTemplateType & { to: string };

export type SendMailFunction = (
  emailConfig: EmailType | object
) => Promise<object>;

export type UserObjectSanitizerFunction = (
  userObject: UserObjectType,
  omitFunction: (userDoc: object) => UserObjectType,
  pickFunction: (userDoc: object) => UserObjectType
) => any;

export type PrepareMailFunction = (
  to: string,
  token: string,
  user: UserObjectType,
  pathFragment: string,
  emailTemplate: EmailTemplateType,
  from: string
) => object;

export type AccountsServerConfiguration = AccountsCommonConfiguration & {
  tokenSecret?: string;
  tokenConfigs?: TokenConfig;
  passwordAuthenticator?: PasswordAuthenticator;
  resumeSessionValidator?: ResumeSessionValidator;
  prepareMail?: PrepareMailFunction;
  sendMail?: SendMailFunction;
  // https://github.com/eleith/emailjs#emailserverconnectoptions
  email?: object;
  emailTokensExpiry?: number;
  impersonationAuthorize: (
    user: UserObjectType,
    impersonateToUser: UserObjectType
  ) => Promise<any>;
  validateNewUser?: (user: CreateUserType) => Promise<boolean>;
  userObjectSanitizer?: UserObjectSanitizerFunction;
  allowedLoginFields?: string[];
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
};
