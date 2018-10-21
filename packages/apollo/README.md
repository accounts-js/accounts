# @accounts/apollo

[![npm](https://img.shields.io/npm/v/@accounts/apollo.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/apollo)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
yarn add @accounts/apollo
```

## Usage

```js
import accountsApollo from '@accounts/apollo';

const accounts = accountsApollo({
  uri: 'http//:localhost:4000'
});

accounts.client.loginWithService('password', {
  user: {
    email: 'user@user.com',
    password: '1234567,
  }
})

// Add accounts link to apollo client

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    accounts.link,
    httpLink
  ]),
  cache,
});
```
