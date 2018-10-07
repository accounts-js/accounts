import AccountsServer from '@accounts/server';
import { QueryResolvers } from '../types/graphql';

export const getAccountsOptions = (
  accountsServer: AccountsServer
): QueryResolvers.GetAccountsOptionsResolver => async () => {
  const options = accountsServer.getOptions();

  const services = Object.keys(accountsServer.getServices()).map(key => ({
    name: key,
  }));

  return {
    siteUrl: options.siteUrl,
    siteTitle: options.siteTitle,
    services,
  };
};
