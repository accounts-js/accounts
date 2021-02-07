import { User, TokenRecord } from '@accounts/types';

export const getUserResetTokens = (user: User): TokenRecord[] => {
  return user.services?.password?.reset ?? [];
};

export const getUserVerificationTokens = (user: User): TokenRecord[] => {
  return user.services?.email?.verificationTokens ?? [];
};
