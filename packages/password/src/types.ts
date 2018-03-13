import { CreateUserType, HashAlgorithm, LoginUserIdentityType } from '@accounts/common';

export type PasswordType =
  | string
  | {
      digest: string;
      algorithm: HashAlgorithm;
    };

export interface PasswordLoginType {
  user: string | LoginUserIdentityType;
  password: PasswordType;
}

export interface PasswordCreateUserType extends CreateUserType {
  password: PasswordType;
}
