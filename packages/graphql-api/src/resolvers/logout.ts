import { AccountsServer } from '@accounts/server';
import { MutationResolvers } from '../types/graphql';

export const logout = (accountsServer: AccountsServer): MutationResolvers.LogoutResolver => async (
  _: null,
  __: null,
  context
) => {
  const { authToken } = context;

  await accountsServer.logout(authToken);

  return null;
};
