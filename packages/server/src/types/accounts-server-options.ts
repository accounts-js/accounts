import { User, DatabaseInterface } from '@accounts/types';
import { EmailTemplatesType } from './email-templates-type';
import { UserObjectSanitizerFunction } from './user-object-sanitizer-function';
import { ResumeSessionValidator } from './resume-session-validator';
import { PrepareMailFunction } from './prepare-mail-function';
import { SendMailType } from './send-mail-type';

export interface AccountsServerOptions {
  db: DatabaseInterface;
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
  impersonationAuthorize?: (user: User, impersonateToUser: User) => Promise<any>;
  resumeSessionValidator?: ResumeSessionValidator;
  siteUrl?: string;
  prepareMail?: PrepareMailFunction;
  sendMail?: SendMailType;
}
