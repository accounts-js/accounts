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
  /**
   * Will throw if no username or email is provided.
   */
  UsernameOrEmailRequired = 'UsernameOrEmailRequired',
  /**
   * Username validation via option `validateUsername` failed.
   */
  InvalidUsername = 'InvalidUsername',
  /**
   * Email validation via option `validateEmail` failed.
   */
  InvalidEmail = 'InvalidEmail',
  /**
   * Password validation via option `validatePassword` failed.
   */
  InvalidPassword = 'InvalidPassword',
  /**
   * Email already exist in the database.
   */
  EmailAlreadyExists = 'EmailAlreadyExists',
  /**
   * Username already exist in the database.
   */
  UsernameAlreadyExists = 'UsernameAlreadyExists',
}

export enum AddEmailErrors {
  /**
   * Email validation via option `validateEmail` failed.
   */
  InvalidEmail = 'InvalidEmail',
}

export enum VerifyEmailErrors {
  /**
   * Will throw if token validation failed.
   */
  InvalidToken = 'InvalidToken',
  /**
   * The token does not exist or is expired.
   */
  VerifyEmailLinkExpired = 'VerifyEmailLinkExpired',
  /**
   * The token is valid but no email address found for the entry.
   */
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
  /**
   * Password validation via option `validatePassword` failed.
   */
  InvalidPassword = 'InvalidPassword',
  /**
   * User has no email set.
   */
  NoEmailSet = 'NoEmailSet',
  // thrown by PasswordAuthenticatorErrors
  InvalidCredentials = 'InvalidCredentials',
  UserNotFound = 'UserNotFound',
  IncorrectPassword = 'IncorrectPassword',
  NoPasswordSet = 'NoPasswordSet',
}

export enum SendVerificationEmailErrors {
  /**
   * Will throw if email validation failed.
   */
  InvalidEmail = 'InvalidEmail',
  /**
   * Will throw if user is not found.
   * If option `ambiguousErrorMessages` is true, this will never throw.
   */
  UserNotFound = 'UserNotFound',
}

export enum SendResetPasswordEmailErrors {
  /**
   * Will throw if email validation failed.
   */
  InvalidEmail = 'InvalidEmail',
  /**
   * Will throw if user is not found.
   * If option `ambiguousErrorMessages` is true, this will never throw.
   */
  UserNotFound = 'UserNotFound',
}

export enum SendEnrollmentEmailErrors {
  /**
   * Will throw if email validation failed.
   */
  InvalidEmail = 'InvalidEmail',
  /**
   * Will throw if user is not found.
   * If option `ambiguousErrorMessages` is true, this will never throw.
   */
  UserNotFound = 'UserNotFound',
}
