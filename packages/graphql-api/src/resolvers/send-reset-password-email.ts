import AccountsServer from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { MutationResolvers } from '../types/graphql';

export const sendResetPasswordEmail = (
  accountsServer: AccountsServer
): MutationResolvers.SendResetPasswordEmailResolver => async (_: null, args) => {
  const { email } = args;

  const password = accountsServer.getServices().password as AccountsPassword;

  if (!(typeof password.sendResetPasswordEmail === 'function')) {
    throw new Error('No service handle password reset.');
  }

  await password.sendResetPasswordEmail(email);
  return null;
};
