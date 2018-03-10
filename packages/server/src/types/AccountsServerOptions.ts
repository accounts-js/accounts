import { UserObjectType } from '@accounts/common';
import { DBInterface } from './DBInterface'
import { EmailTemplateType } from './EmailTemplateType'
import { EmailTemplatesType } from './EmailTemplatesType'
import { UserObjectSanitizerFunction } from './UserObjectSanitizerFunction';
import { ResumeSessionValidator } from './ResumeSessionValidator';
import { PrepareMailFunction } from './PrepareMailFunction';
import { SendMailType } from './SendMailType';

export interface AccountsServerOptions {
  db: DBInterface;
  tokenSecret: string;
  tokenConfigs?: {
    accessToken?: {
      expiresIn?: string;
    };
    refreshToken?: {
      expiresIn?: string;
    };
  };
  emailTokensExpiry?: number;
  emailTemplates?: EmailTemplatesType;
  userObjectSanitizer?: UserObjectSanitizerFunction;
  impersonationAuthorize?: (
    user: UserObjectType,
    impersonateToUser: UserObjectType
  ) => Promise<any>;
  resumeSessionValidator?: ResumeSessionValidator;
  siteUrl?: string;
  prepareMail?: PrepareMailFunction;
  sendMail?: SendMailType;
  // https://github.com/eleith/emailjs#emailserverconnectoptions
  email?: object;
}