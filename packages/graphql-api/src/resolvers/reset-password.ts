import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { MutationResolvers } from '../types/graphql';

export const resetPassword = (
  accountsServer: AccountsServer
): MutationResolvers.ResetPasswordResolver => async (_: null, args) => {
  const { token, newPassword } = args;

  const password = accountsServer.getServices().password as AccountsPassword;

  await password.resetPassword(token, newPassword);
  return null;
};
