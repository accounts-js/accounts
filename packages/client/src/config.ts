import {
  config as sharedConfig,
  AccountsCommonConfiguration,
  HookListener,
  PasswordSignupFields,
} from '@accounts/common';
import { Store, Middleware } from 'redux';

export type AccountsClientConfiguration = AccountsCommonConfiguration & {
  store?: Store<object>;
  reduxLogger?: Middleware;
  reduxStoreKey?: string;
  server?: string;
  tokenStoragePrefix?: string;
  title?: string;
  requestPermissions?: any[];
  requestOfflineToken?: object;
  forceApprovalPrompt?: object;
  requireEmailVerification?: boolean;
  loginPath?: string;
  signUpPath?: string;
  resetPasswordPath?: string;
  profilePath?: string;
  changePasswordPath?: string;
  homePath?: string;
  signOutPath?: string;
  onEnrollAccountHook?: HookListener;
  onResetPasswordHook?: HookListener;
  onVerifyEmailHook?: HookListener;
  onSignedInHook?: HookListener;
  onSignedOutHook?: HookListener;
  onResumedSessionHook?: HookListener;
  onUserCreated?: (user: object) => Promise<any>;
  loginOnSignUp?: boolean;
  history?: string[];
  persistImpersonation?: boolean;
};

export default {
  ...sharedConfig,
  store: null,
  reduxLogger: null,
  reduxStoreKey: 'accounts',
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
  loginOnSignUp: true,
  persistImpersonation: true,
};
