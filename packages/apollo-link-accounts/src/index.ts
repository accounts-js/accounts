import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { AccountsClient } from '@accounts/client';

type AccountsClientFactory = () => AccountsClient | Promise<AccountsClient>;

export const accountsLink = (accountsClientFactory: AccountsClientFactory): ApolloLink => {
  return setContext(async (req, { headers: headersWithoutTokens }) => {
    const accountsClient = await accountsClientFactory();
    const headers = { ...headersWithoutTokens };

    if (req.operationName !== 'refreshTokens') {
      const tokens = await accountsClient.refreshSession();
      if (tokens) {
        headers.Authorization = 'Bearer ' + tokens.accessToken;
      }
    }

    return {
      headers,
    };
  });
};
