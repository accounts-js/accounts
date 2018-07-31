import AccountsServer from '@accounts/server';
import { QueryResolvers } from '../types/graphql';

export const getUser = (accountsServer: AccountsServer): QueryResolvers.GetUserResolver => async (
  _: null,
  __: null,
  context
) => {
  const { authToken } = context;

  return authToken && accountsServer.resumeSession(authToken);
};
