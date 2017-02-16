// @flow

import { trim, isEmpty } from 'lodash';

export const isEmail = (email: ?string) => {
  // eslint-disable-next-line
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email && re.test(email);
};

export const validateEmail = (email: ?string): boolean => {
  const isValid = !isEmpty(trim(email));
  return isValid;
};

export const validatePassword = (password: ?string): boolean => {
  const isValid = !isEmpty(password);
  return isValid;
};

export const validateUsername = (username: ?string): boolean => {
  const isValid = !isEmpty(trim(username));
  return isValid;
};
