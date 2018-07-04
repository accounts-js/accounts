import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { MutationResolvers } from '../types/graphql';

export const resetPassword = (
  accountsServer: AccountsServer
): MutationResolvers.ResetPasswordResolver => async (_: null, args) => {
  const { token, newPassword } = args;

  const password = accountsServer.getServices().password as AccountsPassword;

  if (!(typeof password.resetPassword === 'function')) {
    throw new Error('No service handle password reset.');
  }

  await password.resetPassword(token, newPassword);
  return null;
};
