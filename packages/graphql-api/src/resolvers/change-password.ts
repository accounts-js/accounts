import { IResolverContext } from '../types/graphql';
import AccountsServer from '@accounts/server';
import { AccountsPassword } from '@accounts/password';

export const changePassword = (accountsServer: AccountsServer) => async (
  _: null,
  args: GQL.IChangePasswordOnMutationArguments,
  ctx: IResolverContext
) => {
  const { oldPassword, newPassword } = args;
  const { user } = ctx;

  if (!(user && user.id)) {
    throw new Error('Unauthorized');
  }

  const userId = user.id;
  const password = accountsServer.getServices().password as AccountsPassword;

  if (!(typeof password.changePassword === 'function')) {
    throw new Error('No service handle password modification.');
  }

  return password.changePassword(userId, oldPassword, newPassword);
};
