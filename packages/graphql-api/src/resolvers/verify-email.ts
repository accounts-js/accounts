import { AccountsServer } from '@accounts/server';
import { IResolverContext } from '../types/graphql';
import { AccountsPassword } from '@accounts/password';

export const verifyEmail = (accountsServer: AccountsServer) => async (
  _: null,
  args: GQL.IVerifyEmailOnMutationArguments,
  ctx: IResolverContext
) => {
  const { token } = args;

  const password: any = accountsServer.getServices().password as AccountsPassword;

  if (!(typeof password.verifyEmail === 'function')) {
    throw new Error('No service handle email verification.');
  }

  return password.verifyEmail(token);
};

export const sendVerificationEmail = (accountsServer: AccountsServer) => async (
  _: null,
  args: GQL.ISendVerificationEmailOnMutationArguments,
  ctx: IResolverContext
) => {
  const { email } = args;

  const password: any = accountsServer.getServices().password as AccountsPassword;

  if (!(typeof password.sendVerificationEmail === 'function')) {
    throw new Error('No service handle email verification.');
  }

  return password.sendVerificationEmail(email);
};
