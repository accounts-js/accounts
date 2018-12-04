import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';

export const accountsLink = ({ headerName = 'accounts-access-token' }): ApolloLink => {
  return setContext(async (_, { headers: headersWithoutTokens }) => {
    const headers = { ...headersWithoutTokens };

    const token = localStorage.getItem('accounts:accessToken');

    if (token) {
      headers[headerName] = token;
    }

    return {
      headers,
    };
  });
};
