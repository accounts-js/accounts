import isEmpty from 'lodash/isEmpty';

export default {
  logIn(accountsClient, { user, password }) {
    const errors = {};
    if (!user) {
      errors.user = 'Username or Email is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    return isEmpty(errors) ? null : errors;
  },
};
