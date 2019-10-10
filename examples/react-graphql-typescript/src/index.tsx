import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { apolloClient } from './utils/accounts';
import Router from './Router';

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Router />
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
);
