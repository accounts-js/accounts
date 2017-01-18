import { EMAIL_ONLY } from './passwordSignupFields';
import redirect from './redirect';
// eslint-disable-next-line import/no-named-as-default
import AccountsClient from '../client/AccountsClient';

export const defaultSharedConfig = {
  sendVerificationEmail: false,
  forbidClientAccountCreation: false,
  restrictCreationByEmailDomain: null,
  loginExpirationInDays: 90,
  passwordResetTokenExpirationInDays: 3,
  passwordEnrollTokenExpirationInDays: 30,
  passwordSignupFields: EMAIL_ONLY,
  minimumPasswordLength: 7,
  path: '/accounts',
};

export const defaultClientConfig = {
  ...defaultSharedConfig,
  reduxLogger: null,
  server: '',
  localStoragePrefix: '',
  title: '',
  requestPermissions: [],
  requestOfflineToken: {},
  forceApprovalPrompt: {},
  requireEmailVerification: false,
  loginPath: '/',
  signUpPath: null,
  resetPasswordPath: null,
  profilePath: '/',
  changePasswordPath: null,
  homePath: '/',
  // TODO enable all of these
  // onSubmitHook: () => {},
  // onPreSignUpHook: () => new Promise(resolve => resolve()),
  // onPostSignUpHook: () => {},
  onEnrollAccountHook: () => redirect(AccountsClient.options().loginPath),
  onResetPasswordHook: () => redirect(AccountsClient.options().loginPath),
  onVerifyEmailHook: () => redirect(AccountsClient.options().profilePath),
  onSignedInHook: () => redirect(AccountsClient.options().homePath),
  onSignedOutHook: () => redirect(AccountsClient.options().homePath),
  loginOnSignUp: true,
};

export const defaultServerConfig = {
  ...defaultSharedConfig,
  tokenSecret: 'terrible secret',
  tokenConfigs: {
    accessToken: {
      expiresIn: '90m',
    },
    refreshToken: {
      expiresIn: '1d',
    },
  },
  // TODO Investigate oauthSecretKey
  // oauthSecretKey
};
