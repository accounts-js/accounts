import { User } from '../../user';

export interface DatabaseInterfaceServiceToken<CustomUser extends User = User> {
  findUserByLoginToken(token: string): Promise<CustomUser | null>;

  addLoginToken(userId: string, email: string, token: string, reason: string): Promise<void>;

  removeAllLoginTokens(userId: string): Promise<void>;
}
