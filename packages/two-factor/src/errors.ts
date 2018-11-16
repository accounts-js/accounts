import { ErrorMessages } from './types';

export const errors: ErrorMessages = {
  userNotFound: 'User not found',
  codeDidNotMatch: `2FA code didn't match`,
  userTwoFactorNotSet: `2FA not set`,
  userTwoFactorAlreadySet: `2FA already set`,
  codeRequired: '2FA code required',
};
