import { ErrorMessages } from './types';

export const errors: ErrorMessages = {
  userNotFound: 'User not found',
  incorrectToken: 'Incorrect token',
  unrecognizedOptionsForLogin: 'Unrecognized options for login request',
  matchFailed: 'Match failed',
  invalidUsername: 'Invalid username',
  invalidEmail: 'Invalid email',
  invalidToken: 'Invalid token',
  invalidCredentials: 'Invalid credentials',
  loginTokenExpired: 'Login token expired',
};

export enum TokenAuthenticatorErrors {
  InvalidCredentials = 'InvalidCredentials',
  UserNotFound = 'UserNotFound',
  IncorrectToken = 'IncorrectToken',
  NoTokenSet = 'NoTokenSet',
  LoginTokenExpired = 'LoginTokenExpired',
}

export enum AuthenticateErrors {
  UnrecognizedOptionsForLogin = 'UnrecognizedOptionsForLogin',
  MatchFailed = 'MatchFailed',
  // thrown by PasswordAuthenticatorErrors
  InvalidCredentials = 'InvalidCredentials',
  UserNotFound = 'UserNotFound',
  IncorrectToken = 'IncorrectToken',
  NoTokenSet = 'NoTokenSet',
}

export enum RequestLoginTokenErrors {
  InvalidEmail = 'InvalidEmail',
  UserNotFound = 'UserNotFound',
}
