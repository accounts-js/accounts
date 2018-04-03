import TokenManager from '@accounts/token-manager';
import { User, DatabaseInterface, AuthenticationServices } from '@accounts/types';
import { EmailTemplateType } from './email-template-type';
import { EmailTemplatesType } from './email-templates-type';
import { UserObjectSanitizerFunction } from './user-object-sanitizer-function';
import { ResumeSessionValidator } from './resume-session-validator';
import { PrepareMailFunction } from './prepare-mail-function';
import { SendMailType } from './send-mail-type';

export interface AccountsServerOptions {
  db: DatabaseInterface;
  tokenManager: TokenManager;
  authenticationServices: AuthenticationServices;
  emailTemplates?: EmailTemplatesType;
  userObjectSanitizer?: UserObjectSanitizerFunction;
  impersonationAuthorize?: (user: User, impersonateToUser: User) => Promise<any>;
  resumeSessionValidator?: ResumeSessionValidator;
  siteUrl?: string;
  prepareMail?: PrepareMailFunction;
  sendMail?: SendMailType;
}
