import { Tokens } from './tokens';
import { User } from './user';

export interface LoginResult {
  sessionId: string;
  tokens: Tokens;
  user: User;
}
