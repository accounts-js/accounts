import { config as sharedConfig } from '@accounts/common';
import AccountsClient from './AccountsClient';
import redirect from './redirect';

export default {
  ...sharedConfig,
  store: null,
  reduxLogger: null,
  reduxStoreKey: 'accounts',
  tokenStorage: global.localStorage,
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
