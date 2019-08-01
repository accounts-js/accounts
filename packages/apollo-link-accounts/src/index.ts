import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { AccountsClient } from '@accounts/client';

type AccountsClientFactory = () => AccountsClient | Promise<AccountsClient>;

export const accountsLink = (accountsClientFactory: AccountsClientFactory): ApolloLink => {
  return setContext(async (_, { headers: headersWithoutTokens }) => {
    const accountsClient = await accountsClientFactory();
    const tokens = await accountsClient.refreshSession();

    const headers = { ...headersWithoutTokens };

    if (tokens) {
      headers.Authorization = 'Bearer ' + tokens.accessToken;
    }

    return {
      headers,
    };
  });
};
