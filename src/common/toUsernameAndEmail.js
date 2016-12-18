/**
 * Checks if a string is actualy an email.
 * Thank you http://stackoverflow.com/a/46181.
 *
 * @param {string} email - presumably an email
 * @returns {boolean} whether or not it is an email
 */
function isEmail(email) {
  // eslint-disable-next-line
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/**
  * Given a username, user and/or email figure out the username and/or email.
  *
  * @param {Object} object An object containing at least `username`, `user` and/or `email`.
  * @return {Object} user An object containing `username` and `email`.
  */
const toUsernameAndEmail = ({ user, username, email }) => {
  if (user && !username && !email) {
    if (isEmail(user)) {
      email = user; // eslint-disable-line no-param-reassign
      username = null; // eslint-disable-line no-param-reassign
    } else {
      username = user; // eslint-disable-line no-param-reassign
      email = null; // eslint-disable-line no-param-reassign
    }
  }
  return { username, email };
};

export default toUsernameAndEmail;
