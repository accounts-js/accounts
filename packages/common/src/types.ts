import { HashAlgorithm } from './config';

export interface TokenRecord {
  token: string;
  address: string;
  when: number;
  reason: string;
}

export interface EmailRecord {
  address: string;
  verified: boolean;
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
  profile?: object;
}

export interface LoginUserIdentityType {
  id?: string;
  username?: string;
  email?: string;
}

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
