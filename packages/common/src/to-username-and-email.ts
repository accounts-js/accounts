import { isEmail } from './validators';

/**
 * Given a username, user and/or email figure out the username and/or email.
 *
 * @param {Object} An object containing at least `username`, `user` and/or `email`.
 * @returns {Object} An object containing `username` and `email`.
 */
const toUsernameAndEmail = ({
  user,
  username,
  email,
  id,
}: {
  user?: string;
  username?: string;
  email?: string;
  id?: string;
}) => {
  if (user && !username && !email) {
    if (isEmail(user)) {
      email = user;
      username = null;
    } else {
      username = user;
      email = null;
    }
  }
  return { username, email, id };
};

export default toUsernameAndEmail;
