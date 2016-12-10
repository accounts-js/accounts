/* eslint-disable max-len */

import { each, keys, includes, trim, isEmpty, merge, extend } from 'lodash';
import { Iterable, fromJS, Map, Stack } from 'immutable';
import { Form } from 'immutable-form';
import createStore from './createStore';
import toUsernameAndEmail from './toUsernameAndEmail';

const ACCESS_TOKEN = 'js-accounts:accessToken';
const REFRESH_TOKEN = 'js-accounts:refreshToken';

const PATH = 'js-accounts/';
const LOGIN = `${PATH}LOGIN`;
const SET_USER = `${PATH}SET_USER`;

const initialState = fromJS({
  formType: 'login',
  isLoading: false,
  user: null,
});

const reducer = (state = initialState, action) => {
  let nextState = state;
  switch (action.type) {
    case LOGIN: {
      break;
    }
    case SET_USER: {
      const { user } = action.payload;
      nextState = merge({}, state, {
        user,
      });
      break;
    }
    default:
      break;
  }
  return nextState;
};

const store = createStore({
  reducers: {
    accounts: reducer,
  },
});

const validateUser = (value) => {

};

const validatePassword = (value) => {

};

const createLoginForm = () => new Form('login', {
  fields: {
    user: {
      value: '',
      validate: [validateUser],
    },
    password: {
      value: '',
      validate: [validatePassword],
    },
  },
});

const Accounts = {
  reducer,
  store,
  forms: {
    login: createLoginForm(),
  },
  setUser(user) {
    this.dispatch({
      type: SET_USER,
      payload: {
        user,
      },
    });
  },
  async loginWithPassword(user, password, callback) {
    this.forms.login.setField('user', {
      value: user,
      error: null,
    });

    this.forms.login.setField('login', {
      value: user,
      error: null,
    });

    const promise = new Promise((resolve) => {
      resolve();
    });

    return this.forms.login(promise);

    // TODO Validation

    // TODO Send login request with client
    // TODO Run on success or failure hooks
  },
};
/**
 * @summary Accounts UI
 * @namespace
 * @memberOf Accounts
 */
Accounts.ui = {
};

Accounts.ui._options = {
  title: '',
  requestPermissions: [],
  requestOfflineToken: {},
  forceApprovalPrompt: {},
  requireEmailVerification: false,
  // TODO Replace these strings with references to './passwordSignupFields'
  passwordSignupFields: 'EMAIL_ONLY_NO_PASSWORD',
  minimumPasswordLength: 7,
  loginPath: '/',
  signUpPath: null,
  resetPasswordPath: null,
  profilePath: '/',
  changePasswordPath: null,
  homeRoutePath: '/',
  onSubmitHook: () => {},
  onPreSignUpHook: () => new Promise(resolve => resolve()),
  onPostSignUpHook: () => {},
  // TODO history agnostic redirects
  // onEnrollAccountHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  // onResetPasswordHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  // onVerifyEmailHook: () => redirect(`${Accounts.ui._options.profilePath}`),
  onSignedInHook: () => null,
  onSignedOutHook: () => null,
  forbidClientAccountCreation: false,
};

/**
 * @summary Configure the behavior of [`<Accounts.ui.login />`](#react-accounts-ui).
 * @anywhere
 * @param {Object} options
 * @param {Object} options.requestPermissions Which [permissions](#requestpermissions) to request from the user for each external service.
 * @param {Object} options.requestOfflineToken To ask the user for permission to act on their behalf when offline, map the relevant external service to `true`. Currently only supported with Google.
 * @param {Object} options.forceApprovalPrompt If true, forces the user to approve the app's permissions, even if previously approved. Currently only supported with Google.
 * @param {String} options.passwordSignupFields Which fields to display in the user creation form. One of '`USERNAME_AND_EMAIL`', '`USERNAME_AND_OPTIONAL_EMAIL`', '`USERNAME_ONLY`', '`EMAIL_ONLY`', or '`NO_PASSWORD`' (default).
 */
Accounts.ui.config = (options) => {
  const serverConfig = {};
  // const serverConfig = await Accounts.client.accountsConfig();
  // validate options keys
  const VALID_KEYS = [
    'title',
    'passwordSignupFields',
    'requestPermissions',
    'requestOfflineToken',
    'forbidClientAccountCreation',
    'requireEmailVerification',
    'minimumPasswordLength',
    'loginPath',
    'signUpPath',
    'resetPasswordPath',
    'profilePath',
    'changePasswordPath',
    'homeRoutePath',
    'onSubmitHook',
    'onPreSignUpHook',
    'onPostSignUpHook',
    'onEnrollAccountHook',
    'onResetPasswordHook',
    'onVerifyEmailHook',
    'onSignedInHook',
    'onSignedOutHook',
  ];

  each(keys(options), (key) => {
    if (!includes(VALID_KEYS, key)) {
      throw new Error(`Accounts.ui.config: Invalid key: ${key}`);
    }
  });

  if (typeof options.title === 'string') {
    Accounts.ui._options.title = options.title;
  } else {
    throw new Error(`Accounts.ui.config: Invalid option for \`title\`: ${options.title}`);
  }

  Accounts.ui._options.forbidClientAccountCreation = options.forbidClientAccountCreation;

  // deal with `passwordSignupFields`
  if (options.passwordSignupFields) {
    if (includes([
      'USERNAME_AND_EMAIL',
      'USERNAME_AND_OPTIONAL_EMAIL',
      'USERNAME_ONLY',
      'EMAIL_ONLY',
      'EMAIL_ONLY_NO_PASSWORD',
      'USERNAME_AND_EMAIL_NO_PASSWORD',
    ], options.passwordSignupFields)) {
      Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;
    } else {
      throw new Error(`Accounts.ui.config: Invalid option for \`passwordSignupFields\`: ${options.passwordSignupFields}`);
    }
  }

  // deal with `requestPermissions`
  if (options.requestPermissions) {
    each(options.requestPermissions, (scope, service) => {
      if (Accounts.ui._options.requestPermissions[service]) {
        throw new Error(`Accounts.ui.config: Can't set \`requestPermissions\` more than once for ${service}`);
      } else if (!(scope instanceof Array)) {
        throw new Error('Accounts.ui.config: Value for `requestPermissions` must be an array');
      } else {
        Accounts.ui._options.requestPermissions[service] = scope;
      }
    });
  }

  // deal with `requestOfflineToken`
  if (options.requestOfflineToken) {
    each(options.requestOfflineToken, (value, service) => {
      if (service !== 'google') {
        throw new Error('Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.');
      }
      if (Accounts.ui._options.requestOfflineToken[service]) {
        throw new Error(`Accounts.ui.config: Can't set \`requestOfflineToken\` more than once for ${service}`);
      } else {
        Accounts.ui._options.requestOfflineToken[service] = value;
      }
    });
  }

  // deal with `forceApprovalPrompt`
  if (options.forceApprovalPrompt) {
    each(options.forceApprovalPrompt, (value, service) => {
      if (service !== 'google') {
        throw new Error('Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.');
      }

      if (Accounts.ui._options.forceApprovalPrompt[service]) {
        throw new Error(`Accounts.ui.config: Can't set \`forceApprovalPrompt\` more than once for ${service}`);
      } else {
        Accounts.ui._options.forceApprovalPrompt[service] = value;
      }
    });
  }

  // deal with `requireEmailVerification`
  if (options.requireEmailVerification) {
    if (typeof options.requireEmailVerification !== 'boolean') {
      throw new Error('Accounts.ui.config: "requireEmailVerification" not a boolean');
    } else {
      Accounts.ui._options.requireEmailVerification = options.requireEmailVerification;
    }
  }

  // deal with `minimumPasswordLength`
  if (options.minimumPasswordLength) {
    if (typeof options.minimumPasswordLength !== 'number') {
      throw new Error('Accounts.ui.config: "minimumPasswordLength" not a number');
    } else {
      Accounts.ui._options.minimumPasswordLength = options.minimumPasswordLength;
    }
  }

  // deal with the hooks.
  for (const hook of ['onSubmitHook', 'onPreSignUpHook', 'onPostSignUpHook']) {
    if (options[hook]) {
      if (typeof options[hook] !== 'function') {
        throw new Error(`Accounts.ui.config: "${hook}" not a function`);
      } else {
        Accounts.ui._options[hook] = options[hook];
      }
    }
  }

  // deal with the paths.
  for (const path of [
    'loginPath',
    'signUpPath',
    'resetPasswordPath',
    'profilePath',
    'changePasswordPath',
    'homeRoutePath',
  ]) {
    if (options[path]) {
      if (typeof options[path] !== 'string') {
        throw new Error(`Accounts.ui.config: ${path} is not a string`);
      } else {
        Accounts.ui._options[path] = options[path];
      }
    }
  }

  // deal with redirect hooks.
  for (const hook of [
    'onEnrollAccountHook',
    'onResetPasswordHook',
    'onVerifyEmailHook',
    'onSignedInHook',
    'onSignedOutHook']) {
    if (options[hook]) {
      if (typeof options[hook] === 'function') {
        Accounts.ui._options[hook] = options[hook];
      } else if (typeof options[hook] === 'string') {
        // TODO Agnostically deal with redirects
        // Accounts.ui._options[hook] = () => redirect(options[hook]);
      } else {
        throw new Error(`Accounts.ui.config: "${hook}" not a function or an absolute or relative path`);
      }
    }
  }

  Accounts.ui._options = { ...Accounts.ui._options, ...serverConfig };
};

export default Accounts;
