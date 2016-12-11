import { defaultServerConfig } from '../common/defaultConfigs';
import { AccountsError } from '../common/errors';
import AccountsCommon from '../common/AccountsCommon';

class Accounts extends AccountsCommon {
  constructor(options, db) {
    super(options);
    if (!db) {
      throw new AccountsError({
        message: 'A database driver is required',
      });
    }
    this.db = db;
  }
}

const AccountsServer = {
  config(options, db) {
    this.instance = new Accounts({
      ...defaultServerConfig,
      ...options,
    }, db);
  },
  createUser(...args) {
    return this.instance.createUser(...args);
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
