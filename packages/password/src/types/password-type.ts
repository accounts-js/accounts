import { HashAlgorithm } from '@accounts/common';

export type PasswordType =
  | string
  | {
      digest: string;
      algorithm: HashAlgorithm;
    };
