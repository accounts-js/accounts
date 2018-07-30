import { AccountsServer } from '@accounts/server';
import { MutationResolvers } from '../types/graphql';

export const logout = (accountsServer: AccountsServer): MutationResolvers.LogoutResolver => async (
  _: null,
  args,
  context
) => {
  const { accessToken } = args;
  const { authToken } = context;

  await accountsServer.logout(accessToken || authToken);

  return null;
};
