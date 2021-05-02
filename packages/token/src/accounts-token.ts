import {
  User,
  DatabaseInterface,
  AuthenticationService,
  LoginUserTokenService,
  TokenRecord,
} from '@accounts/types';
import { AccountsServer, AccountsJsError, generateRandomToken } from '@accounts/server';
import { verifyToken } from './utils';
import { ErrorMessages } from './types';
import { errors, AuthenticateErrors, TokenAuthenticatorErrors } from './errors';
import { isString } from './utils/validation';
import { RequestLoginTokenErrors } from './errors';
import { getUserLoginTokens } from './utils/user';

export interface AccountsTokenOptions {
  /**
   * Accounts token module errors
   */
  errors?: ErrorMessages;
  /**
   * Function called to verify the token.
   */
  verifyToken?: (token?: string, storedTokenEmail?: string) => boolean;
  /**
   * The number of milliseconds from when a link with a login token is sent until token expires and user can't login with it.
   * Defaults to 15 minutes.
   */
  loginTokenExpiration?: number;
}

const defaultOptions = {
  errors,
  verifyToken,
  // 15 minutes - 15 * 60 * 1000
  loginTokenExpiration: 900000,
};

export default class AccountsToken<CustomUser extends User = User>
  implements AuthenticationService {
  public serviceName = 'token';
  public server!: AccountsServer;
  private options: AccountsTokenOptions & typeof defaultOptions;
  private db!: DatabaseInterface<CustomUser>;

  constructor(options: AccountsTokenOptions = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  public setStore(store: DatabaseInterface<CustomUser>) {
    this.db = store;
  }

  public async requestLoginToken(email: string): Promise<void> {
    if (!email || !isString(email)) {
      throw new AccountsJsError(
        this.options.errors.invalidEmail,
        RequestLoginTokenErrors.InvalidEmail
      );
    }

    const user = await this.db.findUserByEmail(email);
    if (!user) {
      throw new AccountsJsError(
        this.options.errors.userNotFound,
        RequestLoginTokenErrors.UserNotFound
      );
    }

    const token = generateRandomToken();
    await this.db.addLoginToken(user.id, email, token, 'login-token-requested');

    const requestLoginTokenMail = this.server.prepareMail(
      email,
      token,
      this.server.sanitizeUser(user),
      'token-login',
      this.server.options.emailTemplates.loginToken,
      this.server.options.emailTemplates.from
    );

    await this.server.options.sendMail(requestLoginTokenMail);
  }

  public async authenticate(params: LoginUserTokenService): Promise<CustomUser> {
    const { token } = params;
    if (!token) {
      throw new AccountsJsError(
        this.options.errors.unrecognizedOptionsForLogin,
        AuthenticateErrors.UnrecognizedOptionsForLogin
      );
    }
    if (!isString(token)) {
      throw new AccountsJsError(this.options.errors.matchFailed, AuthenticateErrors.MatchFailed);
    }

    const foundUser = await this.tokenAuthenticator(token);

    return foundUser;
  }

  public isTokenExpired(tokenRecord: TokenRecord, expiryDate: number): boolean {
    return Number(tokenRecord.when) + expiryDate < Date.now();
  }

  private async tokenAuthenticator(token: string): Promise<CustomUser> {
    const foundUser: CustomUser | null = await this.db.findUserByLoginToken(token);

    if (!foundUser) {
      if (this.server.options.ambiguousErrorMessages) {
        throw new AccountsJsError(
          this.options.errors.invalidCredentials,
          TokenAuthenticatorErrors.InvalidCredentials
        );
      } else {
        throw new AccountsJsError(
          this.options.errors.userNotFound,
          TokenAuthenticatorErrors.UserNotFound
        );
      }
    }

    const loginTokens = getUserLoginTokens(foundUser);
    const tokenRecord = loginTokens.find((t: TokenRecord) => t.token === token);
    if (!tokenRecord) {
      throw new AccountsJsError(
        this.options.errors.incorrectToken,
        TokenAuthenticatorErrors.IncorrectToken
      );
    }

    if (this.isTokenExpired(tokenRecord, this.options.loginTokenExpiration)) {
      throw new AccountsJsError(
        this.options.errors.loginTokenExpired,
        TokenAuthenticatorErrors.LoginTokenExpired
      );
    }

    return foundUser;
  }
}
