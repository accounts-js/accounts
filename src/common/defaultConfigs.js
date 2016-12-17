import { EMAIL_ONLY_NO_PASSWORD } from './passwordSignupFields';

export const defaultSharedConfig = {
  sendVerificationEmail: false,
  forbidClientAccountCreation: false,
  restrictCreationByEmailDomain: null,
  loginExpirationInDays: 90,
  passwordResetTokenExpirationInDays: 3,
  passwordEnrollTokenExpirationInDays: 30,
};

export const defaultClientConfig = {
  ...defaultSharedConfig,
};

export const defaultServerConfig = {
  ...defaultSharedConfig,
  // TODO Investigate oauthSecretKey
  // oauthSecretKey
};

export const defaultUiConfig = {
  title: '',
  requestPermissions: [],
  requestOfflineToken: {},
  forceApprovalPrompt: {},
  requireEmailVerification: false,
  passwordSignupFields: EMAIL_ONLY_NO_PASSWORD,
  minimumPasswordLength: 7,
  loginPath: '/',
  signUpPath: null,
  resetPasswordPath: null,
  profilePath: '/',
  changePasswordPath: null,
  homeRoutePath: '/',
  // TODO enable all of these
  // onSubmitHook: () => {},
  // onPreSignUpHook: () => new Promise(resolve => resolve()),
  // onPostSignUpHook: () => {},
  // onEnrollAccountHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  // onResetPasswordHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  // onVerifyEmailHook: () => redirect(`${Accounts.ui._options.profilePath}`),
  // onSignedInHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
  // onSignedOutHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
};
