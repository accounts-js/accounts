# @accounts/graphql-client

_Client side graphql transport for accounts suite_

[![npm](https://img.shields.io/npm/v/@accounts/graphql-client.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/graphql-client) ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
yarn add @accounts/graphql-client
```

## Usage

```js
import { ApolloClient } from 'apollo-client';
import { AccountsGraphQLClient } from '@accounts/graphql-client';

const apolloClient = new ApolloClient({
  // apollo options
});

const accountsGraphQL = new AccountsGraphQLClient({
  graphQLClient: apolloClient,
  // other options
});
```
