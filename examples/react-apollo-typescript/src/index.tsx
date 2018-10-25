import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { accountsApollo } from '@accounts/apollo';
import { Accounts, AccountsProvider, Auth } from '@accounts/react';
import accountsComponents from '@accounts/react-material-ui';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

const accounts = accountsApollo({
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
    accounts.link,
    new HttpLink({
      uri: 'http://localhost:4000',
    }),
  ]),
});

const App = () => (
  <div>
    <ApolloProvider client={client}>
      <AccountsProvider accounts={accounts} components={accountsComponents}>
        <Accounts />
      </AccountsProvider>
      <Auth>
        {({ user }) => {
          console.log(user);
        }}
      </Auth>
    </ApolloProvider>
  </div>
);

export default App;

ReactDOM.render(<App /> as any, document.getElementById('root') as HTMLElement);
registerServiceWorker();
