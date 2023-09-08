import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { AccountsClient } from '@accounts/client';

type AccountsClientFactory = () => AccountsClient | Promise<AccountsClient>;

export const accountsLink = (accountsClientFactory: AccountsClientFactory): ApolloLink => {
  return setContext(async (req, { headers: headersWithoutTokens }) => {
    const accountsClient = await accountsClientFactory();
    const headers = { ...headersWithoutTokens };

    /**
     * We have to check this condition to avoid an infinite loop
     * during the refresh token operation
     */
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
