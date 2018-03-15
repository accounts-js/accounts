import { CreateUserType, HashAlgorithm } from '@accounts/common';
import { TwoFactorConfiguration } from '@accounts/two-factor';

import { PasswordType } from './password-type';

export interface Configuration {
  twoFactor?: TwoFactorConfiguration;
  passwordHashAlgorithm?: HashAlgorithm;
  passwordResetTokenExpirationInDays?: number;
  passwordEnrollTokenExpirationInDays?: number;
  minimumPasswordLength?: number;
  validateNewUser?: (user: CreateUserType) => Promise<boolean>;
  validateEmail?(email?: string): boolean;
  validatePassword?(password?: PasswordType): boolean;
  validateUsername?(username?: string): boolean;
}