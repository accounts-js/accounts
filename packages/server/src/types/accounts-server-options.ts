import * as jwt from 'jsonwebtoken';
import { User, DatabaseInterface, Session } from '@accounts/types';
import { EmailTemplatesType } from './email-templates-type';
import { UserObjectSanitizerFunction } from './user-object-sanitizer-function';
import { PrepareMailFunction } from './prepare-mail-function';
import { SendMailType } from './send-mail-type';
import { TokenCreator } from './token-creator';
import { JwtData } from './jwt-data';

export interface AccountsServerOptions<CustomUser extends User = User> {
  /**
   * Return ambiguous error messages from login failures to prevent user enumeration. Defaults to true.
   */
  ambiguousErrorMessages?: boolean;
  db?: DatabaseInterface<CustomUser>;
  tokenSecret:
    | string
    | {
        publicKey: jwt.Secret;
        privateKey: jwt.Secret;
      };
  tokenConfigs?: {
    accessToken?: jwt.SignOptions;
    refreshToken?: jwt.SignOptions;
  };
  emailTemplates?: EmailTemplatesType;
  userObjectSanitizer?: UserObjectSanitizerFunction;
  impersonationAuthorize?: (user: User, impersonateToUser: User) => Promise<any>;
  /**
   * Use this function if you want to cancel the current session to be resumed.
   * The session parameter will be null if the `useStatelessSession` option is set to true.
   */
  resumeSessionValidator?: (user: User, session: Session) => Promise<void>;
  siteUrl?: string;
  prepareMail?: PrepareMailFunction;
  sendMail?: SendMailType;
  tokenCreator?: TokenCreator;
  /**
   * Creates a new session token each time a user refreshes his access token
   */
  createNewSessionTokenOnRefresh?: boolean;
  /**
   * Function to add addition information in jwt payload of accessToken
   */
  createJwtPayload?: (data: JwtData, user: CustomUser) => Promise<Record<string, any>>;
  /**
   * If this flag is set to true - user will be automatically logged in after registration.
   * LoginResult data will be included into registration response.
   */
  enableAutologin?: boolean;
  /**
   * Set this false to `false` if you wish to skip internal user sanitazing method, and expose
   * the original User object as-is.
   */
  useInternalUserObjectSanitizer?: boolean;
  /**
   * Should the session mechanism be stateless. By default the token is checked against the database in every
   * request. This allow you to revoke a session at any time.
   * Since we are using JWT you can decide to have a stateless session. This means that the token won't be
   * checked against the database on every request. Using the stateless approach will make the server authorisation
   * check faster but this means that you won't be able to able to invalidate the access token until it's expired.
   * Only use this option if you understand the downsides of this approach.
   * Default 'false'.
   */
  useStatelessSession?: boolean;
}
