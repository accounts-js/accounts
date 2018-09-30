import * as React from 'react';
import './App.css';

import { accountsApollo } from '@accounts/apollo';
import { Accounts, AccountsProvider } from '@accounts/react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

const { accountsLink, accountsClient, accountsPassword } = accountsApollo({
  uri: 'http://localhost:4000',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    accountsLink,
    new HttpLink({
      uri: 'http://localhost:4000',
    }),
  ]),
});

const App = () => (
  <div>
    <ApolloProvider client={client}>
      <AccountsProvider
        accountsClient={accountsClient}
        accountsPassword={accountsPassword}
        theme="material-ui"
      >
        <Accounts />
      </AccountsProvider>
    </ApolloProvider>
  </div>
);

export default App;
