// @flow

import { config as sharedConfig } from '@accounts/common';
import type { AccountsCommonConfiguration } from '@accounts/common';
import type { Store } from 'redux';
import AccountsClient from './AccountsClient';
import redirect from './redirect';

export interface TokenStorage {
  getItem(key: string): Promise<string>,
  removeItem(key: string): Promise<string>,
  setItem(key: string, value: string): Promise<string>
}

export type AccountsClientConfiguration = AccountsCommonConfiguration & {
  store?: ?Store<Object, Object>,
  reduxLogger?: ?Object,
  reduxStoreKey?: string,
  tokenStorage?: ?TokenStorage,
  server?: string,
  tokenStoragePrefix?: string,
  title?: string,
  requestPermissions?: Array<any>,
  requestOfflineToken?: Object,
  forceApprovalPrompt?: Object,
  requireEmailVerification?: boolean,
  loginPath?: string,
  signUpPath?: ?string,
  resetPasswordPath?: ?string,
  profilePath?: string,
  changePasswordPath?: ?string,
  homePath?: string,
  signOutPath?: string,
  onEnrollAccountHook?: Function,
  onResetPasswordHook?: Function,
  onVerifyEmailHook?: Function,
  onSignedInHook?: Function,
  onSignedOutHook?: Function,
  onResumedSessionHook?: Function,
  onUserCreated?: (user: ?Object) => Promise<any>,
  loginOnSignUp?: boolean,
  history?: Object,
  persistImpersonation?: boolean
};

export default {
  ...sharedConfig,
  store: null,
  reduxLogger: null,
  reduxStoreKey: 'accounts',
  tokenStorage: global.localStorage,
  server: '',
  tokenStoragePrefix: '',
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
  signOutPath: '/',
  // TODO enable all of these
  // onSubmitHook: () => {},
  // onPreSignUpHook: () => new Promise(resolve => resolve()),
  // onPostSignUpHook: () => {},
  onEnrollAccountHook: () => redirect(AccountsClient.options().loginPath || '/'),
  onResetPasswordHook: () => redirect(AccountsClient.options().loginPath || '/'),
  onVerifyEmailHook: () => redirect(AccountsClient.options().profilePath || '/'),
  onSignedInHook: () => redirect(AccountsClient.options().homePath || '/'),
  onSignedOutHook: () => redirect(AccountsClient.options().signOutPath || '/'),
  loginOnSignUp: true,
  persistImpersonation: true,
};
