import { HashAlgorithm } from './config';

export type PasswordType =
  | string
  | {
      digest: string;
      algorithm: HashAlgorithm;
    };

export interface EmailRecord {
  address: string;
}

export interface UserObjectType {
  username?: string;
  email?: string;
  emails?: EmailRecord[];
  id: string;
  profile?: object;
  services?: object;
}

export interface CreateUserType {
  username?: string;
  email?: string;
  password?: PasswordType;
  profile?: object;
}

export interface PasswordLoginUserIdentityType {
  id?: string;
  username?: string;
  email?: string;
}

export type PasswordLoginUserType = string | PasswordLoginUserIdentityType;

export interface TokensType {
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginReturnType {
  sessionId: string;
  user: UserObjectType;
  tokens: TokensType;
}

export interface ImpersonateReturnType {
  authorized: boolean;
  tokens?: TokensType;
  user?: UserObjectType;
}

export interface SessionType {
  sessionId: string;
  userId: string;
  valid: boolean;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export type HookListener = (event?: object) => void;
