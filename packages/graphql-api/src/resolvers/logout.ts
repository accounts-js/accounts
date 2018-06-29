import { AccountsServer } from '@accounts/server';
import { IResolverContext } from '../types/graphql';

export const logout = (accountsServer: AccountsServer) => async (
  _: null,
  args: GQL.ILogoutOnMutationArguments,
  ctx: IResolverContext
) => {
  const { accessToken } = args;

  await accountsServer.logout(accessToken);

  return 'Logged out';
};
