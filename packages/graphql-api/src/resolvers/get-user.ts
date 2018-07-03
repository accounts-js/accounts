import AccountsServer from '@accounts/server';
import { QueryResolvers } from '../types/graphql';

export const getUser = (accountsServer: AccountsServer): QueryResolvers.GetUserResolver => async (
  _: null,
  args
) => {
  const { accessToken } = args;

  return accountsServer.resumeSession(accessToken);
};
