import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { MutationResolvers } from '../types/graphql';

export const verifyEmail = (
  accountsServer: AccountsServer
): MutationResolvers.VerifyEmailResolver => async (_, args) => {
  const { token } = args;

  const password = accountsServer.getServices().password as AccountsPassword;

  await password.verifyEmail(token);
  return null;
};

export const sendVerificationEmail = (
  accountsServer: AccountsServer
): MutationResolvers.SendVerificationEmailResolver => async (_, args) => {
  const { email } = args;

  const password = accountsServer.getServices().password as AccountsPassword;

  await password.sendVerificationEmail(email);
  return null;
};
