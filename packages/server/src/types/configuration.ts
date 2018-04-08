import TokenManager from '@accounts/token-manager';
import { User, DatabaseInterface, AuthenticationService, NotificationService, UserSafe } from '@accounts/types';
import { ResumeSessionValidator } from './resume-session-validator';

export interface Configuration {
  db: DatabaseInterface;
  tokenManager: TokenManager;
  authenticationServices?: AuthenticationService[];
  notificationServices?: NotificationService[];
  sanitizeUser?: (user: UserSafe) => UserSafe;
  impersonationAuthorize?: (user: User, impersonateToUser: User) => Promise<any>;
  resumeSessionValidator?: ResumeSessionValidator
}
