import { ErrorMessages } from './types';

export const errors: ErrorMessages = {
  userNotFound: 'User not found',
  noPasswordSet: 'User has no password set',
  incorrectPassword: 'Incorrect password',
  unrecognizedOptionsForLogin: 'Unrecognized options for login request',
  matchFailed: 'Match failed',
  invalidEmail: 'Invalid email',
  invalidPassword: 'Invalid password',
  invalidNewPassword: 'Invalid new password',
  invalidToken: 'Invalid token',
  verifyEmailLinkExpired: 'Verify email link expired',
  verifyEmailLinkUnknownAddress: 'Verify email link is for unknown address',
  resetPasswordLinkExpired: 'Reset password link expired',
  resetPasswordLinkUnknownAddress: 'Verify email link is for unknown address',
  usernameAlreadyExists: 'Username already exists',
  emailAlreadyExists: 'Email already exists',
  usernameOrEmailRequired: 'Username or Email is required',
};
