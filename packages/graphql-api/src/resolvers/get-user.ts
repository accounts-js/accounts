import AccountsServer from '@accounts/server';
import { QueryResolvers } from '../types/graphql';

export const getUser = (accountsServer: AccountsServer): QueryResolvers.GetUserResolver => async (
  _: null,
  args,
  context
) => {
  const { accessToken } = args;
  const { authToken } = context;

  return accountsServer.resumeSession(accessToken || authToken);
};
