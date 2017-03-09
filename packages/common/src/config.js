// @flow
import { EMAIL_ONLY } from './passwordSignupFields';
import type { PasswordSignupFields } from './passwordSignupFields';

export type HashAlgorithm =
  'sha' | 'sha1' | 'sha224' | 'sha256' | 'sha384' | 'sha512' | 'md5' | 'ripemd160';

export type AccountsCommonConfiguration = {
  siteUrl?: string,
  sendVerificationEmail?: boolean,
  sendEnrollmentEmail?: boolean,
  sendWelcomeEmail?: boolean,
  forbidClientAccountCreation?: boolean,
  restrictCreationByEmailDomain?: ?string,
  passwordResetTokenExpirationInDays?: number,
  passwordEnrollTokenExpirationInDays?: number,
  passwordSignupFields?: PasswordSignupFields,
  minimumPasswordLength?: number,
  path?: string,
  passwordHashAlgorithm?: HashAlgorithm
};

export default ({
  siteUrl: 'http://localhost:3000',
  sendVerificationEmail: false,
  sendEnrollmentEmail: false,
  sendWelcomeEmail: false,
  forbidClientAccountCreation: false,
  restrictCreationByEmailDomain: null,
  passwordResetTokenExpirationInDays: 3,
  passwordEnrollTokenExpirationInDays: 30,
  passwordSignupFields: EMAIL_ONLY,
  minimumPasswordLength: 7,
  path: '/accounts',
}: AccountsCommonConfiguration);
