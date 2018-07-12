# @accounts/server

[![npm](https://img.shields.io/npm/v/@accounts/server.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/server)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
yarn add @accounts/server
```

## Usage

```js
import { AccountsServer } from '@accounts/server';

const accountsServer = new AccountsServer({
  db: accountsDatabase,
  tokenSecret: ..., // a random string
}, {
  // accounts-js services
});
```
