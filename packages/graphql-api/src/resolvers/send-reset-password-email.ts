import AccountsServer from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { MutationResolvers } from '../types/graphql';

export const sendResetPasswordEmail = (
  accountsServer: AccountsServer
): MutationResolvers.SendResetPasswordEmailResolver => async (_: null, args) => {
  const { email } = args;

  const password = accountsServer.getServices().password as AccountsPassword;

  await password.sendResetPasswordEmail(email);
  return null;
};
