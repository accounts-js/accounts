// @flow

import { defaultServerConfig } from '../common/defaultConfigs';
import { AccountsError } from '../common/errors';
import AccountsCommon from '../common/AccountsCommon';
import type { AccountsOptionsType } from '../common/AccountsCommon';
import type UserObjectType from '../common/UserObjectType';
import DBDriver from './DBDriver';

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
