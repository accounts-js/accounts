import { EMAIL_ONLY } from './passwordSignupFields';
// eslint-disable-next-line import/no-named-as-default

export default {
  sendVerificationEmail: false,
  forbidClientAccountCreation: false,
  restrictCreationByEmailDomain: null,
  loginExpirationInDays: 90,
  passwordResetTokenExpirationInDays: 3,
  passwordEnrollTokenExpirationInDays: 30,
  passwordSignupFields: EMAIL_ONLY,
  minimumPasswordLength: 7,
  path: '/accounts',
};
