import { type User } from '@accounts/types';
import { type TwoFactorService } from '../types';

/**
 * Return the user two factor service object
 */
export const getUserTwoFactorService = (user: User): TwoFactorService | null => {
  return user.services?.['two-factor'] ?? null;
};
