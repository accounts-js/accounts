import { type Tokens } from './tokens';
import { type User } from './user';

export interface LoginResult {
  sessionId: string;
  tokens: Tokens;
  user: User;
}
