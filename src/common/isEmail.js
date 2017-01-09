/**
 * Checks if a string is actualy an email.
 * Thank you http://stackoverflow.com/a/46181.
 *
 * @param {string} email - presumably an email
 * @returns {boolean} whether or not it is an email
 */
const isEmail = (email) => {
  // eslint-disable-next-line
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export default isEmail;
