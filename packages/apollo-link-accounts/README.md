# @accounts/apollo-link

[![npm](https://img.shields.io/npm/v/@accounts/apollo-link.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/apollo-link)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
yarn add @accounts/apollo-link
```

## Usage

```js
import { accountsLink } from '@accounts/apollo-link';

const accountsClient = new AccountsClient( ... );
const authLink = accountsLink(accountsClient);

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache,
});
```
