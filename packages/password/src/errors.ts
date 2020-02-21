import { ErrorMessages } from './types';

export const errors: ErrorMessages = {
  userNotFound: 'User not found',
  noPasswordSet: 'User has no password set',
  noEmailSet: 'User has no email set',
  incorrectPassword: 'Incorrect password',
  unrecognizedOptionsForLogin: 'Unrecognized options for login request',
  matchFailed: 'Match failed',
  invalidUsername: 'Invalid username',
  invalidEmail: 'Invalid email',
  invalidPassword: 'Invalid password',
  invalidNewPassword: 'Invalid new password',
  invalidToken: 'Invalid token',
  invalidCredentials: 'Invalid credentials',
  verifyEmailLinkExpired: 'Verify email link expired',
  verifyEmailLinkUnknownAddress: 'Verify email link is for unknown address',
  resetPasswordLinkExpired: 'Reset password link expired',
  resetPasswordLinkUnknownAddress: 'Reset password link is for unknown address',
  usernameAlreadyExists: 'Username already exists',
  emailAlreadyExists: 'Email already exists',
  usernameOrEmailRequired: 'Username or Email is required',
};

export enum CreateUserErrors {
  InvalidUsername = 'InvalidUsername',
  InvalidEmail = 'InvalidEmail',
  InvalidPassword = 'InvalidPassword',
  EmailAlreadyExists = 'EmailAlreadyExists',
  UsernameAlreadyExists = 'UsernameAlreadyExists',
}

export enum AddEmailErrors {
  /**
   * Email validation via option `validateEmail` failed.
   */
  InvalidEmail = 'InvalidEmail',
}

export enum VerifyEmailErrors {
  InvalidToken = 'InvalidToken',
  VerifyEmailLinkExpired = 'VerifyEmailLinkExpired',
  VerifyEmailLinkUnknownAddress = 'VerifyEmailLinkUnknownAddress',
}

export enum ResetPasswordErrors {
  /**
   * Will throw if token validation failed.
   */
  InvalidToken = 'InvalidToken',
  /**
   * Password validation via option `validatePassword` failed.
   */
  InvalidNewPassword = 'InvalidNewPassword',
  /**
   * The token does not exist or is expired.
   */
  ResetPasswordLinkExpired = 'ResetPasswordLinkExpired',
  /**
   * The token is valid but no email address found for the entry.
   */
  ResetPasswordLinkUnknownAddress = 'ResetPasswordLinkUnknownAddress',
  /**
   * User has no email set.
   */
  NoEmailSet = 'NoEmailSet',
}

export enum PasswordAuthenticatorErrors {
  InvalidCredentials = 'InvalidCredentials',
  UserNotFound = 'UserNotFound',
  IncorrectPassword = 'IncorrectPassword',
  NoPasswordSet = 'NoPasswordSet',
}

export enum AuthenticateErrors {
  UnrecognizedOptionsForLogin = 'UnrecognizedOptionsForLogin',
  MatchFailed = 'MatchFailed',
  // thrown by PasswordAuthenticatorErrors
  InvalidCredentials = 'InvalidCredentials',
  UserNotFound = 'UserNotFound',
  IncorrectPassword = 'IncorrectPassword',
  NoPasswordSet = 'NoPasswordSet',
}

export enum ChangePasswordErrors {
  InvalidPassword = 'InvalidPassword',
  NoEmailSet = 'NoEmailSet',
  // thrown by PasswordAuthenticatorErrors
  InvalidCredentials = 'InvalidCredentials',
  UserNotFound = 'UserNotFound',
  IncorrectPassword = 'IncorrectPassword',
  NoPasswordSet = 'NoPasswordSet',
}

export enum SendVerificationEmailErrors {
  InvalidEmail = 'InvalidEmail',
  UserNotFound = 'UserNotFound',
}

export enum SendResetPasswordEmailErrors {
  InvalidEmail = 'InvalidEmail',
  UserNotFound = 'UserNotFound',
}
