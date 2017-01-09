// @flow

import { isString } from 'lodash';
import { defaultServerConfig } from '../common/defaultConfigs';
import { AccountsError } from '../common/errors';
import AccountsCommon from '../common/AccountsCommon';
import type { AccountsOptionsType } from '../common/AccountsCommon';
import type UserObjectType from '../common/UserObjectType';
import DBDriver from './DBDriver';
import toUsernameAndEmail from '../common/toUsernameAndEmail';

export type UserCreationInputType = {
  username: ?string,
  password: ?string,
  email: ?string,
  profile: ?Object
};

class Accounts extends AccountsCommon {
  options: AccountsOptionsType
  db: DBDriver
  constructor(options: AccountsOptionsType, db: DBDriver) {
    super(options);
    if (!db) {
      throw new AccountsError({
        message: 'A database driver is required',
      });
    }
    this.db = db;
  }
  async loginWithPassword(user: string, password: string): Promise<boolean> {
    if (!user || !password) {
      throw new AccountsError({ message: 'Unrecognized options for login request [400]' });
    }
    if (!isString(user) || !isString(password)) {
      throw new AccountsError({ message: 'Match failed [400]' });
    }
    const { username, email } = toUsernameAndEmail({ user });
    let userId;
    if (username) {
      userId = await this.db.findUserByUsername(username, true);
    }
    if (email) {
      userId = await this.db.findUserByEmail(email, true);
    }
    if (!userId) {
      throw new AccountsError({ message: 'User not found [403]' });
    }
    const hash = await this.db.findPasswordHash(userId);
    if (!hash) {
      throw new AccountsError({ message: 'User has no password set [403]' });
    }
    const isValidPassword = await this.db.verifyPassword(password, hash);
    if (!isValidPassword) {
      throw new AccountsError({ message: 'Incorrect password [403]' });
    }
    return isValidPassword;
  }
  async createUser(user: UserCreationInputType): Promise<string> {
    if (!this.validateUsername(user.username, false) && !this.validateEmail(user.email, false)) {
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
  findUserByEmail(email: string, onlyId: ?boolean): Promise<UserObjectType | string | null> {
    return this.db.findUserByEmail(email, onlyId);
  }
  findUserByUsername(username: string, onlyId: ?boolean): Promise<UserObjectType | string | null> {
    return this.db.findUserByUsername(username, onlyId);
  }
  findUserById(userId: string): Promise<?UserObjectType> {
    return this.db.findUserById(userId);
  }
}

const AccountsServer = {
  instance: Accounts,
  config(options: AccountsOptionsType, db: DBDriver) {
    this.instance = new Accounts({
      ...defaultServerConfig,
      ...options,
    }, db);
  },
  options(): AccountsOptionsType {
    return this.instance.options;
  },
  loginWithPassword(user: string, password: string): Promise<boolean> {
    return this.instance.loginWithPassword(user, password);
  },
  createUser(user: UserCreationInputType): Promise<string> {
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
};


//   validateUser(callback) {
//
//   },
//   validateLoginAttempt(callback) {
//   },
//   createUser(options, callback) {
//
//   },
//   setUsername(userId, newUsername) {
//
//   },
//   addEmail(userId, newEmail, verified = false) {
//
//   },
//   removeEmail(userId, email) {
//
//   },
//   verifyEmail(token, callback) {
//
//   },
//   findUserByUsername(username) {
//
//   },
//   findUserByEmail(email) {
//
//   },
//   setPassword(userId, newPassword, optons) {
//
//   },
//   sendResetPasswordEmail(userId, email) {
//
//   },
//   sendEnrollmentEmail(userId, email) {
//
//   },
//   sendVerificationEmail(userId, email) {
//
//   },
//   emailTemplates(templates) {
//
//   },
// };

export default AccountsServer;
