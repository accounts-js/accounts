import AccountsCommon from './AccountsCommon';

class AccountsClient extends AccountsCommon {
  // TODO Handle options
  constructor(options) {
    super(options);
  }
  validateUser(callback) {

  }
  onCreateUser(callback) {

  }
  validateLoginAttempt(callback) {
  }
  createUser(options, callback) {

  }
  setUsername(userId, newUsername) {

  }
  addEmail(userId, newEmail, verified = false) {

  }
  removeEmail(userId, email) {

  }
  verifyEmail(token, callback) {

  }
  findUserByUsername(username) {

  }
  findUserByEmail(email) {

  }
  setPassword(userId, newPassword, optons) {

  }
  sendResetPasswordEmail(userId, email) {

  }
  sendEnrollmentEmail(userId, email) {

  }
  sendVerificationEmail(userId, email) {

  }
  emailTemplates(templates) {

  }
}

export default AccountsClient;
