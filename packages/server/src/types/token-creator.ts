import { User } from '@accounts/types';

export interface TokenCreator {
  createToken(user: User): Promise<string>;
}
