import { AccountsServer } from '@accounts/server';
import { IResolverContext } from '../types/graphql';
import { AccountsPassword } from '@accounts/password';

export const resetPassword = (accountsServer: AccountsServer) => async (
  _: null,
  args: GQL.IResetPasswordOnMutationArguments,
  ctx: IResolverContext
) => {
  const { token, newPassword } = args;

  const password: any = accountsServer.getServices().password as AccountsPassword;

  if (!(typeof password.resetPassword === 'function')) {
    throw new Error('No service handle password reset.');
  }

  return password.resetPassword(token, newPassword);
};
