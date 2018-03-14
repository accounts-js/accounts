import { CreateUserType, HashAlgorithm, LoginUserIdentityType } from '@accounts/common';

export type PasswordType =
  | string
  | {
      digest: string;
      algorithm: HashAlgorithm;
    };

export interface PasswordLoginType {
  user: string | LoginUserIdentityType;
  // User password
  password: PasswordType;
  // Two factor code
  code?: string;
}

export interface PasswordCreateUserType extends CreateUserType {
  password: PasswordType;
}
