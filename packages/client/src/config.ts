import {
  config as sharedConfig,
  AccountsCommonConfiguration,
  HookListener,
  PasswordSignupFields,
} from '@accounts/common';
import { Store, Middleware } from 'redux';
import AccountsClient from './accounts-client';
import redirect from './redirect';

export interface TokenStorage {
  getItem(key: string): Promise<string>;
  removeItem(key: string): Promise<string>;
  setItem(key: string, value: string): Promise<string>;
}

export type AccountsClientConfiguration = AccountsCommonConfiguration & {
  store?: Store<object>;
  reduxLogger?: Middleware;
  reduxStoreKey?: string;
  tokenStorage?: TokenStorage;
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

const localStorageToTokenStorage = () => {
  return {
    getItem(key: string) {
      return Promise.resolve(localStorage.getItem(key));
    },
    removeItem(key: string) {
      const value = localStorage.getItem(key);
      localStorage.removeItem(key);
      return Promise.resolve(value);
    },
    setItem(key: string, value: string) {
      localStorage.setItem(key, value);
      return Promise.resolve(value);
    },
  };
};

export default {
  ...sharedConfig,
  store: null,
  reduxLogger: null,
  reduxStoreKey: 'accounts',
  tokenStorage: localStorageToTokenStorage(),
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
  onEnrollAccountHook: () =>
    redirect(AccountsClient.options().loginPath || '/'),
  onResetPasswordHook: () =>
    redirect(AccountsClient.options().loginPath || '/'),
  onVerifyEmailHook: () =>
    redirect(AccountsClient.options().profilePath || '/'),
  onSignedInHook: () => redirect(AccountsClient.options().homePath || '/'),
  onSignedOutHook: () => redirect(AccountsClient.options().signOutPath || '/'),
  loginOnSignUp: true,
  persistImpersonation: true,
};
