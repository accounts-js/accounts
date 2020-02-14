import { HashAlgorithm } from '../../hash-algorithm';

export type PasswordType =
  | string
  | {
      digest: string;
      algorithm: HashAlgorithm;
    };
