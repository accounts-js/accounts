// @flow

import { isString, isPlainObject } from 'lodash';
import jwt from 'jsonwebtoken';
import { defaultServerConfig } from '../common/defaultConfigs';
import { AccountsError } from '../common/errors';
import type { DBInterface } from './DBInterface';
import toUsernameAndEmail from '../common/toUsernameAndEmail';
import { verifyPassword } from './encryption';
import {
  generateAccessToken,
  generateRefreshToken,
} from './tokens';
import {
  validateEmail,
  validateUsername,
} from '../common/validators';
import type {
  UserObjectType,
  CreateUserType,
  PasswordLoginUserType,
  LoginReturnType,
  TokensType,
  SessionType,
} from '../common/types';

export class AccountsServer {
  options: Object
  db: DBInterface
  constructor(options: Object, db: DBInterface) {
    this.options = options;
    if (!db) {
      throw new AccountsError({
        message: 'A database driver is required',
      });
    }
    this.db = db;
  }
  // eslint-disable-next-line max-len
  async loginWithPassword(user: PasswordLoginUserType, password: string, ip: ?string, userAgent: ?string): Promise<LoginReturnType> {
    if (!user || !password) {
      throw new AccountsError({ message: 'Unrecognized options for login request [400]' });
    }
    if ((!isString(user) && !isPlainObject(user)) || !isString(password)) {
      throw new AccountsError({ message: 'Match failed [400]' });
    }

    const { username, email, id } = isString(user)
      ? toUsernameAndEmail({ user })
      // $FlowFixMe
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
      throw new AccountsError({ message: 'User not found [403]' });
    }
    // $FlowFixMe
    const hash = await this.db.findPasswordHash(foundUser.id);
    if (!hash) {
      throw new AccountsError({ message: 'User has no password set [403]' });
    }

    const isValidPassword = await verifyPassword(password, hash);
    if (!isValidPassword) {
      throw new AccountsError({ message: 'Incorrect password [403]' });
    }

    const { accessToken, refreshToken } = this.createTokens(foundUser);
    // $FlowFixMe
    await this.db.createSession(foundUser.id, accessToken, refreshToken, ip, userAgent);

    return {
      user: foundUser,
      tokens: {
        refreshToken,
        accessToken,
      },
    };
  }
  async createUser(user: CreateUserType): Promise<string> {
    if (!validateUsername(user.username) && !validateEmail(user.email)) {
      throw new AccountsError({ message: 'Username or Email is required' });
    }
    if (user.username && await this.db.findUserByUsername(user.username)) {
      throw new AccountsError({
        message: 'Username already exists',
      });
    }
    if (user.email && await this.db.findUserByEmail(user.email)) {
      throw new AccountsError({
        message: 'Email already exists',
      });
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
      throw new AccountsError({
        message: 'An accessToken and refreshToken are required',
      });
    }

    try {
      jwt.verify(refreshToken, this.options.tokenSecret);
      jwt.verify(accessToken, this.options.tokenSecret, {
        ignoreExpiration: true,
      });
    } catch (err) {
      throw new AccountsError({
        message: 'Tokens are not valid',
      });
    }

    const session : SessionType = await this.db.findSessionByAccessToken(accessToken);
    if (!session) {
      throw new AccountsError({
        message: 'Session not found',
      });
    }

    if (session.valid) {
      const user = await this.db.findUserById(session.userId);
      if (!user) {
        throw new AccountsError({
          message: 'User not found',
        });
      }
      const tokens = this.createTokens(user);
      await this.db.updateSession(
        // $FlowFixMe
        session.sessionId, tokens.accessToken, tokens.refreshToken, ip, userAgent,
      );
      return {
        user,
        tokens,
      };
    } else { // eslint-disable-line no-else-return
      throw new AccountsError({
        message: 'Session is no longer valid',
      });
    }
  }
  createTokens(user: UserObjectType): TokensType {
    const { tokenSecret, tokenConfigs } = this.options;
    const accessToken = generateAccessToken({
      data: {
        user,
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
  verifyEmail(userId: string, email: string): Promise<void> {
    return this.db.verifyEmail(userId, email);
  }
  setPassword(userId: string, newPassword: string): Promise<void> {
    return this.db.setPasssword(userId, newPassword);
  }
}

const Accounts = {
  instance: AccountsServer,
  config(options: Object, db: DBInterface) {
    this.instance = new AccountsServer({
      ...defaultServerConfig,
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
  verifyEmail(userId: string, email: string): Promise<void> {
    return this.instance.verifyEmail(userId, email);
  },
  setPassword(userId: string, newPassword: string): Promise<void> {
    return this.instance.setPassword(userId, newPassword);
  },
  refreshTokens(
    accessToken: string, refreshToken: string, ip: string, userAgent: string,
  ): Promise<LoginReturnType> {
    return this.instance.refreshTokens(accessToken, refreshToken, ip, userAgent);
  },
};

export default Accounts;
