import { AccountsServer } from '@accounts/server';
import { MutationResolvers } from '../types/graphql';

export const logout = (accountsServer: AccountsServer): MutationResolvers.LogoutResolver => async (
  _: null,
  args
) => {
  const { accessToken } = args;

  await accountsServer.logout(accessToken);

  return null;
};
