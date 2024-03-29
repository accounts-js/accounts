import { type Tokens } from './tokens';
import { type User } from './user';

export interface ImpersonationUserIdentity {
  userId?: string;
  username?: string;
  email?: string;
}

export interface ImpersonationResult {
  authorized: boolean;
  tokens?: Tokens;
  user?: User;
}
