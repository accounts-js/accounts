import { isEmail } from './validators';

/**
  * Given a username, user and/or email figure out the username and/or email.
  *
  * @param {Object} An object containing at least `username`, `user` and/or `email`.
  * @returns {Object} An object containing `username` and `email`.
  */
const toUsernameAndEmail = ({ user, username, email, id }) => {
  if (user && !username && !email) {
    if (isEmail(user)) {
      email = user; // eslint-disable-line no-param-reassign
      username = null; // eslint-disable-line no-param-reassign
    } else {
      username = user; // eslint-disable-line no-param-reassign
      email = null; // eslint-disable-line no-param-reassign
    }
  }
  return { username, email, id };
};

export default toUsernameAndEmail;
