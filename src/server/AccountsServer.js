// @flow

import { isString } from 'lodash';
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
  async loginWithPassword(user: PasswordLoginUserType, password: string): Promise<LoginReturnType> {
    if (!user || !password) {
      throw new AccountsError({ message: 'Unrecognized options for login request [400]' });
    }
    if (!isString(user) || !isString(password)) {
      throw new AccountsError({ message: 'Match failed [400]' });
    }

    const { username, email } = toUsernameAndEmail({ user });

    let foundUser;

    if (username) {
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

    const { tokenSecret, tokenConfigs } = this.options;

    return {
      user: foundUser,
      session: {
        accessToken: generateAccessToken({
          secret: tokenSecret,
          config: tokenConfigs.accessToken,
        }),
        refreshToken: generateRefreshToken({
          secret: tokenSecret,
          config: tokenConfigs.refreshToken,
        }),
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
  loginWithPassword(user: string, password: string): Promise<boolean> {
    return this.instance.loginWithPassword(user, password);
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
    return this.instance.addEmail(userId, newEmail);
  },
  verifyEmail(userId: string, email: string): Promise<void> {
    return this.instance.addEmail(userId, email);
  },
  setPassword(userId: string, newPassword: string): Promise<void> {
    return this.instance.setPassword(userId, newPassword);
  },
};

export default Accounts;
