// @flow

import { isString, isPlainObject, find } from 'lodash';
import jwt from 'jsonwebtoken';
import {
  AccountsError,
  toUsernameAndEmail,
  validators,
} from '@accounts/common';
import type {
  UserObjectType,
  CreateUserType,
  PasswordLoginUserType,
  LoginReturnType,
  TokensType,
  SessionType,
} from '@accounts/common';
import config from './config';
import type { DBInterface } from './DBInterface';
import { verifyPassword } from './encryption';
import {
  generateAccessToken,
  generateRefreshToken,
} from './tokens';

export class AccountsServer {
  options: Object;
  db: DBInterface;
  constructor(options: Object, db: DBInterface) {
    this.options = options;
    if (!db) {
      throw new AccountsError('A database driver is required');
    }
    this.db = db;
  }
  // eslint-disable-next-line max-len
  async loginWithPassword(user: PasswordLoginUserType, password: string, ip: ?string, userAgent: ?string): Promise<LoginReturnType> {
    if (!user || !password) {
      throw new AccountsError('Unrecognized options for login request', user, 400);
    }
    if ((!isString(user) && !isPlainObject(user)) || !isString(password)) {
      throw new AccountsError('Match failed', user, 400);
    }

    let foundUser;

    if (this.options.passwordAuthenticator) {
      try {
        foundUser = await this._externalPasswordAuthenticator(
          this.options.passwordAuthenticator,
          user,
          password);
      } catch (e) {
        throw new AccountsError(e, user, 403);
      }
    } else {
      foundUser = await this._defaultPasswordAuthenticator(user, password);
    }

    if (!foundUser) {
      throw new AccountsError('User not found', user, 403);
    }

    // $FlowFixMe
    const sessionId = await this.db.createSession(foundUser.id || foundUser._id, ip, userAgent);
    const { accessToken, refreshToken } = this.createTokens(sessionId);

    return {
      sessionId,
      user: foundUser,
      tokens: {
        refreshToken,
        accessToken,
      },
    };
  }

  // eslint-disable-next-line max-len
  async _externalPasswordAuthenticator(authFn: Function, user: PasswordLoginUserType, password: string): Promise<any> {
    return authFn(user, password);
  }

  async _defaultPasswordAuthenticator(user: PasswordLoginUserType, password: string): Promise<any> {
    const { username, email, id } = isString(user)
      ? toUsernameAndEmail({ user })
      : toUsernameAndEmail({ ...user });

    let foundUser;

    if (id) {
      foundUser = await this.db.findUserById(id);
    } else if (username) {
      foundUser = await this.db.findUserByUsername(username);
    } else if (email) {
      foundUser = await this.db.findUserByEmail(email);
    }

    if (!foundUser) {
      throw new AccountsError('User not found', user, 403);
    }
    const hash = await this.db.findPasswordHash(foundUser.id);
    if (!hash) {
      throw new AccountsError('User has no password set', user, 403);
    }

    const isPasswordValid = await verifyPassword(password, hash);

    if (!isPasswordValid) {
      throw new AccountsError('Incorrect password', user, 403);
    }

    return foundUser;
  }

  async createUser(user: CreateUserType): Promise<string> {
    if (!validators.validateUsername(user.username) && !validators.validateEmail(user.email)) {
      throw new AccountsError(
        'Username or Email is required',
        {
          username: user && user.username,
          email: user && user.email,
        },
      );
    }
    if (user.username && await this.db.findUserByUsername(user.username)) {
      throw new AccountsError('Username already exists', { username: user.username });
    }
    if (user.email && await this.db.findUserByEmail(user.email)) {
      throw new AccountsError('Email already exists', { email: user.email });
    }

    // TODO Accounts.onCreateUser
    const userId: string = await this.db.createUser({
      username: user.username,
      email: user.email && user.email.toLowerCase(),
      password: user.password,
      profile: user.profile,
    });

    return userId;
  }
  // eslint-disable-next-line max-len
  async refreshTokens(accessToken: string, refreshToken: string, ip: string, userAgent: string): Promise<LoginReturnType> {
    if (!isString(accessToken) || !isString(refreshToken)) {
      throw new AccountsError('An accessToken and refreshToken are required');
    }

    let sessionId;
    try {
      jwt.verify(refreshToken, this.options.tokenSecret);
      const decodedAccessToken = jwt.verify(accessToken, this.options.tokenSecret, {
        ignoreExpiration: true,
      });
      sessionId = decodedAccessToken.data.sessionId;
    } catch (err) {
      throw new AccountsError('Tokens are not valid');
    }

    const session : SessionType = await this.db.findSessionById(sessionId);
    if (!session) {
      throw new AccountsError('Session not found');
    }

    if (session.valid) {
      const user = await this.db.findUserById(session.userId);
      if (!user) {
        throw new AccountsError('User not found', { id: session.userId });
      }
      const tokens = this.createTokens(sessionId);
      await this.db.updateSession(sessionId, ip, userAgent);
      return {
        sessionId,
        user,
        tokens,
      };
    } else { // eslint-disable-line no-else-return
      throw new AccountsError('Session is no longer valid', { id: session.userId });
    }
  }
  createTokens(sessionId: string): TokensType {
    const { tokenSecret, tokenConfigs } = this.options;
    const accessToken = generateAccessToken({
      data: {
        sessionId,
      },
      secret: tokenSecret,
      config: tokenConfigs.accessToken,
    });
    const refreshToken = generateRefreshToken({
      secret: tokenSecret,
      config: tokenConfigs.refreshToken,
    });
    return { accessToken, refreshToken };
  }
  async logout(accessToken: string): Promise<void> {
    const session : SessionType = await this.findSessionByAccessToken(accessToken);
    if (session.valid) {
      const user = await this.db.findUserById(session.userId);
      if (!user) {
        throw new AccountsError('User not found', { id: session.userId });
      }
      await this.db.invalidateSession(session.sessionId);
    } else { // eslint-disable-line no-else-return
      throw new AccountsError('Session is no longer valid', { id: session.userId });
    }
  }
  async resumeSession(accessToken: string): Promise<?UserObjectType> {
    const session : SessionType = await this.findSessionByAccessToken(accessToken);
    if (session.valid) {
      const user = await this.db.findUserById(session.userId);
      if (!user) {
        throw new AccountsError('User not found', { id: session.userId });
      }

      if (this.options.resumeSessionValidator) {
        try {
          await this.options.resumeSessionValidator(user, session);
        } catch (e) {
          throw new AccountsError(e, { id: session.userId }, 403);
        }
      }

      return user;
    }
    return null;
  }
  async findSessionByAccessToken(accessToken: string): Promise<SessionType> {
    if (!isString(accessToken)) {
      throw new AccountsError('An accessToken is required');
    }

    let sessionId;
    try {
      const decodedAccessToken = jwt.verify(accessToken, this.options.tokenSecret);
      sessionId = decodedAccessToken.data.sessionId;
    } catch (err) {
      throw new AccountsError('Tokens are not valid');
    }

    const session : SessionType = await this.db.findSessionById(sessionId);
    if (!session) {
      throw new AccountsError('Session not found');
    }

    return session;
  }
  findUserByEmail(email: string): Promise<?UserObjectType> {
    return this.db.findUserByEmail(email);
  }
  findUserByUsername(username: string): Promise<?UserObjectType> {
    return this.db.findUserByUsername(username);
  }
  findUserById(userId: string): Promise<?UserObjectType> {
    return this.db.findUserById(userId);
  }
  addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    return this.db.addEmail(userId, newEmail, verified);
  }
  removeEmail(userId: string, email: string): Promise<void> {
    return this.db.removeEmail(userId, email);
  }
  async verifyEmail(token: string): Promise<void> {
    const user = await this.db.findUserByEmailVerificationToken();
    if (!user) {
      throw new AccountsError('Verify email link expired');
    }
    const tokenRecord = find(user.services.email.verificationTokens,
                             (t: Object) => t.token === token);
    if (!tokenRecord) {
      throw new AccountsError('Verify email link expired');
    }
    const emailRecord = find(user.emails, (e: Object) => e.address === tokenRecord.address);
    if (!emailRecord) {
      throw new AccountsError('Verify email link is for unknown address');
    }
    await this.db.verifyEmail(user.id, emailRecord);
  }
  setPassword(userId: string, newPassword: string): Promise<void> {
    return this.db.setPasssword(userId, newPassword);
  }
  async setProfile(userId: string, profile: Object): Promise<void> {
    const user = await this.db.findUserById(userId);
    if (!user) {
      throw new AccountsError('User not found', { id: userId });
    }
    await this.db.setProfile(userId, profile);
  }
  async updateProfile(userId: string, profile: Object): Promise<Object> {
    const user = await this.db.findUserById(userId);
    if (!user) {
      throw new AccountsError('User not found', { id: userId });
    }
    const res = await this.db.setProfile(userId, { ...user.profile, ...profile });
    return res;
  }
}

const Accounts = {
  instance: AccountsServer,
  config(options: Object, db: DBInterface) {
    this.instance = new AccountsServer({
      ...config,
      ...options,
    }, db);
  },
  options(): Object {
    return this.instance.options;
  },
  loginWithPassword(
    user: string, password: string, ip: string, userAgent: string,
  ): Promise<LoginReturnType> {
    return this.instance.loginWithPassword(user, password, ip, userAgent);
  },
  createUser(user: CreateUserType): Promise<string> {
    return this.instance.createUser(user);
  },
  findUserByEmail(email: string, onlyId: ?boolean): Promise<UserObjectType | string | null> {
    return this.instance.findUserByEmail(email, onlyId);
  },
  findUserByUsername(username: string, onlyId: ?boolean): Promise<UserObjectType | string | null> {
    return this.instance.findUserByUsername(username, onlyId);
  },
  findUserById(userId: string): Promise<?UserObjectType> {
    return this.instance.findUserById(userId);
  },
  addEmail(userId: string, newEmail: string, verified: boolean): Promise<void> {
    return this.instance.addEmail(userId, newEmail, verified);
  },
  removeEmail(userId: string, newEmail: string): Promise<void> {
    return this.instance.removeEmail(userId, newEmail);
  },
  verifyEmail(token: string): Promise<void> {
    return this.instance.verifyEmail(token);
  },
  setPassword(userId: string, newPassword: string): Promise<void> {
    return this.instance.setPassword(userId, newPassword);
  },
  refreshTokens(
    accessToken: string, refreshToken: string, ip: string, userAgent: string,
  ): Promise<LoginReturnType> {
    return this.instance.refreshTokens(accessToken, refreshToken, ip, userAgent);
  },
  logout(accessToken: string): Promise<void> {
    return this.instance.logout(accessToken);
  },
  resumeSession(accessToken: string): Promise<UserObjectType> {
    return this.instance.resumeSession(accessToken);
  },
  setProfile(userId: string, profile: Object): Promise<void> {
    return this.instance.setProfile(userId, profile);
  },
  updateProfile(userId: string, profile: Object): Promise<Object> {
    return this.instance.updateProfile(userId, profile);
  },
};

export default Accounts;
