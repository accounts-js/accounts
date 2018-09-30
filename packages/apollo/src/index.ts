import { accountsLink } from '@accounts/apollo-link';
import { AccountsClientOptions, AccountsClient } from '@accounts/client';
import AccountsGraphQLClient from '@accounts/graphql-client';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export interface AccountsApolloOptions extends AccountsClientOptions {
  uri: string;
}

export const accountsApollo = (options: AccountsApolloOptions) => {
  const accountsApolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }),
      new HttpLink({
        uri: options.uri,
      }),
    ]),
  });

  const accountsClient = new AccountsClient(
    options,
    new AccountsGraphQLClient({
      graphQLClient: accountsApolloClient,
    })
  );

  let accountsPassword;
  if (require.resolve('@accounts/client-password')) {
    const AccountsClientPassword = require('@accounts/client-password').AccountsClientPassword; // tslint:disable-line no-implicit-dependencies
    accountsPassword = new AccountsClientPassword(accountsClient);
  }

  return {
    accountsClient,
    accountsApolloClient,
    accountsLink: accountsLink(accountsClient),
    accountsPassword,
  };
};

export default accountsApollo;
