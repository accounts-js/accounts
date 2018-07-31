import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { AccountsClient } from '@accounts/client';

export const accountsLink = (accountsClient: AccountsClient): ApolloLink => {
  return setContext(async (_, { headers: headersWithoutTokens }) => {
    const tokens = await accountsClient.refreshSession();

    const headers = { ...headersWithoutTokens };

    if (tokens) {
      headers['accounts-access-token'] = tokens.accessToken;
    }

    return {
      headers,
    };
  });
};
