import { ErrorMessages } from './types';

export const errors: ErrorMessages = {
  notEnoughAuthenticationServices: 'Service requires 2 or more authentications',
  userNotFound: 'User not found',
  serviceIdNotProvided: 'ServiceId not provided to step',
  wrongStep: 'Wrong step',
  notReadyForAuthentication: 'User must complete more authentication steps',
  wrongToken: 'Wrong token',
};
