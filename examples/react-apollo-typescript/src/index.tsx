import './index.css';

import { accountsApollo } from '@accounts/apollo';
import { Accounts, AccountsConsumer, AccountsProvider, Auth, withAuth } from '@accounts/react';
import accountsComponents from '@accounts/react-material-ui';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

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

let UserInfo: any = ({ user }) => <div>{user.id}</div>;

UserInfo = withAuth()(UserInfo) as any;

const Home = () => (
  <div>
    Home page
    <Link to="/sign-in">Sign in</Link>
    <Auth>
      <UserInfo />
    </Auth>
  </div>
);

const MyAccount = () => (
  <AccountsConsumer>{({ user }) => user && <div>ID: {user.id} </div>}</AccountsConsumer>
);

const App = () => (
  <ApolloProvider client={client}>
    <AccountsProvider
      {...accounts}
      components={accountsComponents}
      onSignIn={props => props.history.push('/')}
    >
      <BrowserRouter>
        <>
          <Route exact={true} path="/" component={Home as any} />
          <Route exact={true} path="/sign-in" component={Accounts} />
          <Route exact={true} path="/my-account" component={MyAccount as any} />
        </>
      </BrowserRouter>
    </AccountsProvider>
  </ApolloProvider>
);

export default App;

ReactDOM.render(<App /> as any, document.getElementById('root') as HTMLElement);
registerServiceWorker();
