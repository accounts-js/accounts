/* eslint-disable max-len */

import { each, keys, includes, trim, isEmpty, merge, extend } from 'lodash';
import { Iterable, Map, fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import createStore from './createStore';

const ACCESS_TOKEN = 'js-accounts:accessToken';
const REFRESH_TOKEN = 'js-accounts:refreshToken';

const PATH = 'js-accounts/';
const LOGIN = `${PATH}LOGIN`;
const CLEAR_FORM = `${PATH}CLEAR_FORM`;
const ADD_ERROR = `${PATH}ADD_ERROR`;
const SET_LOADING = `${PATH}SET_LOADING`;
const SET_FIELD = `${PATH}SET_FIELD`;
const CLEAR_ERRORS = `${PATH}CLEAR_ERRORS`;
const SET_USER = `${PATH}SET_USER`;

const initialState = fromJS({
  formType: 'login',
  isLoading: false,
  forms: {
    login: {
      fields: {
        user: {
          value: '',
          errors: [],
        },
        password: {
          value: '',
          errors: [],
        },
      },
      errors: [],
    },
    signupForm: {

    },
  },
  user: null,
});

const reducer = (state = initialState, action) => {
  let nextState = state;
  switch (action.type) {
    case LOGIN: {
      break;
    }
    case CLEAR_FORM: {
      const { form } = action.payload;
      nextState = extend({}, state, {
        forms: {
          [form]: initialState.forms[form],
        },
      });
      break;
    }
    case ADD_ERROR: {
      const { form, field, error } = action.payload;
      const errors = !Array.isArray(error) ? [error] : error;
      if (field) {
        nextState = merge({}, state, {
          forms: {
            [form]: {
              fields: {
                [field]: {
                  errors: [...state.forms[form].fields[field].errors, ...errors],
                },
              },
            },
          },
        });
      } else {
        nextState = merge({}, state, {
          forms: {
            [form]: {
              errors: [...state.forms[form].errors, ...errors],
            },
          },
        });
      }
      break;
    }
    case CLEAR_ERRORS: {
      const { form } = action.payload;
      nextState = merge({}, state);
      const fields = nextState.forms[form].fields;
      const fieldsWithNoErrors = keys(fields).reduce((prev, curr) =>
         ({ ...prev, [curr]: { ...fields[curr], errors: [] } })
      , {});
      nextState.forms[form] = {
        fields: fieldsWithNoErrors,
        errors: [],
      };
      break;
    }
    case SET_LOADING: {
      const { isLoading } = action.payload;
      nextState = merge({}, state, {
        isLoading,
      });
      break;
    }
    case SET_FIELD: {
      const { form, field, value } = action.payload;
      nextState = merge({}, state, {
        forms: {
          [form]: {
            fields: {
              [field]: {
                value,
              },
            },
          },
        },
      });
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

const store = createStore(combineReducers({
  reducers: {
    accounts: reducer,
  },
}));

const Accounts = {
  reducer,
  store,
  getState: (state = Accounts.store.getState()) => (Iterable.isIterable(state) ? state.get('accounts') : state.accounts),
  dispatch(args) {
    return this.store.dispatch(args);
  },
  user() {
    return this.getState(this.store.getState()).user;
  },
  setUser(user) {
    this.dispatch({
      type: SET_USER,
      payload: {
        user,
      },
    });
  },
  async login({ user, password }) {
    this.clearErrors('login');

    // In case the fields aren't set in the redux store, in the scenario that login is being called outside the context of React + Redux
    this.setField({
      form: 'login',
      field: 'user',
      value: user,
    });

    this.setField({
      form: 'login',
      field: 'password',
      value: password,
    });

    // TODO Improve client side validation
    if (!this.validateLogin({ user, password })) {
      this.addError({
        form: 'login',
        error: 'Invalid fields',
      });
      throw new Error('Invalid fields');
    } else {
      this.setLoading(true);
    }

    let toReturn = {};

    try {
      const { accessToken, refreshToken, userId, username } = await this.client.login({ user, password });
      // TODO Handle tokens
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
      // TODO Get user id out of token
      toReturn = {
        // TODO Test for accessToken and refreshToken in relevant test cases
        accessToken,
        refreshToken,
        userId,
        username,
      };
      this.setUser({
        userId,
        username,
      });
      this.setLoading(false);
    } catch (err) {
      // Dispatch to update store with errors
      this.addError({
        form: 'login',
        error: err.message,
      });
      if (Array.isArray(err.errors)) {
        err.errors.forEach(({ field, message }) => this.addError({
          field,
          form: 'login',
          error: message,
        }));
      }
      this.setLoading(false);
      toReturn = err;
    }

    return toReturn;
  },
  async logout() {
    const result = await this.client.logout();
    this.setUser(null);
    return result;
  },
  validateLogin({ user, password }) {
    if (isEmpty(trim(user))) {
      this.addError({
        form: 'login',
        field: 'user',
        error: 'A username or email is required.',
      });
    }
    if (isEmpty(trim(password))) {
      this.addError({
        form: 'login',
        field: 'password',
        error: 'Password is required.',
      });
    }
    return !this.hasError('login');
  },
  signup({ username, email, password, ...otherArgs }) {
    this.client.register({
      username, email, password, ...otherArgs,
    });
  },
  setLoading(isLoading) {
    this.dispatch({
      type: SET_LOADING,
      payload: {
        isLoading,
      },
    });
  },
  setField({ form, field, value }) {
    this.dispatch({
      type: SET_FIELD,
      payload: {
        form, field, value,
      },
    });
  },
  clearForm(form) {
    this.dispatch({
      type: CLEAR_FORM,
      payload: {
        form,
      },
    });
  },
  addError({ form, field, error }) {
    this.dispatch({
      type: ADD_ERROR,
      payload: {
        form,
        field,
        error,
      },
    });
  },
  hasError(form) {
    const formState = this.getState(this.store.getState()).forms[form];
    // Checks all the form's fields for errors and the top level form error
    const hasError = keys(formState.fields).reduce((prev, curr) =>
       prev || (prev === false && formState.fields[curr].errors.length > 0)
    , false) || formState.errors.length > 0;
    return hasError;
  },
  clearErrors(form) {
    this.dispatch({
      type: CLEAR_ERRORS,
      payload: {
        form,
      },
    });
  },
};


// Heavily inspired by https://github.com/studiointeract/accounts-ui/

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
