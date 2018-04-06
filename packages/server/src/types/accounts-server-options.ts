import TokenManager from '@accounts/token-manager';
import { User, DatabaseInterface, AuthenticationService, NotificationService } from '@accounts/types';
import { UserObjectSanitizerFunction } from './user-object-sanitizer-function';
import { ResumeSessionValidator } from './resume-session-validator';

export interface AccountsServerOptions {
  db: DatabaseInterface;
  tokenManager: TokenManager;
  authenticationServices?: AuthenticationService[];
  notificationServices?: NotificationService[];
  userObjectSanitizer?: UserObjectSanitizerFunction;
  impersonationAuthorize?: (user: User, impersonateToUser: User) => Promise<any>;
  resumeSessionValidator?: ResumeSessionValidator
}
