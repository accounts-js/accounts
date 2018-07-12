import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { AccountsClient } from '@accounts/client';

export const accountsLink = (accountsClient: AccountsClient): ApolloLink => {
  return setContext(async (_, { headers }) => {
    const tokens = await accountsClient.refreshSession();
    return {
      headers: {
        ...headers,
        'accounts-access-token': tokens ? tokens.accessToken : null,
      },
    };
  });
};
