import { get } from 'lodash';
import { User } from '@accounts/types';
import { TwoFactorService } from '../types';

/**
 * Return the user two factor service object
 */
export const getUserTwoFactorService = (user: User): TwoFactorService | null => {
  return get(user, ['services', 'two-factor'], null);
};
