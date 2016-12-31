// @flow

import { defaultServerConfig } from '../common/defaultConfigs';
import { AccountsError } from '../common/errors';
import AccountsCommon from '../common/AccountsCommon';
import type { AccountsOptionsType } from '../common/AccountsCommon';
import type { DBDriverInterface } from './DBDriver';
import type UserObjectType from '../common/UserObjectType';


export type UserCreationInputType = {
  username: ?string,
  password: ?string,
  email: ?string,
  profile: ?Object
};

class Accounts extends AccountsCommon {
  options: AccountsOptionsType
  db: DBDriverInterface
  constructor(options: AccountsOptionsType, db: DBDriverInterface) {
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
    const createdUser : UserObjectType = await this.db.createUser(user);

    return createdUser;
  }
}

const AccountsServer = {
  instance: Accounts,
  config(options: AccountsOptionsType, db: DBDriverInterface) {
    this.instance = new Accounts({
      ...defaultServerConfig,
      ...options,
    }, db);
  },
  createUser(user: UserCreationInputType): Promise<string> {
    return this.instance.createUser(user);
  },
  options(): AccountsOptionsType {
    return this.instance.options;
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
