import AccountsServer from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { IResolverContext } from '../types';
import { MutationResolvers } from '../types/graphql';

export const changePassword = (
  accountsServer: AccountsServer
): MutationResolvers.ChangePasswordResolver => async (_, args, ctx: IResolverContext) => {
  const { oldPassword, newPassword } = args;
  const { user } = ctx;

  if (!(user && user.id)) {
    throw new Error('Unauthorized');
  }

  const userId = user.id;
  const password = accountsServer.getServices().password as AccountsPassword;

  await password.changePassword(userId, oldPassword, newPassword);
  return null;
};
