import AccountsServer from '@accounts/server';
import { QueryResolvers } from '../types/graphql';

export const getUser = (accountsServer: AccountsServer): QueryResolvers.GetUserResolver => async (
  _: null,
  __: null,
  context
) => {
  return context.user;
};
