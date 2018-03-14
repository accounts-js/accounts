import { UserObjectType } from '@accounts/common';
import { DBInterface } from './db-interface';
import { EmailTemplateType } from './email-template-type';
import { EmailTemplatesType } from './email-templates-type';
import { UserObjectSanitizerFunction } from './user-object-sanitizer-function';
import { ResumeSessionValidator } from './resume-session-validator';
import { PrepareMailFunction } from './prepare-mail-function';
import { SendMailType } from './send-mail-type';

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
