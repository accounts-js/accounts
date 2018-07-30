# @accounts/client

[![npm](https://img.shields.io/npm/v/@accounts/client.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/client)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
yarn add @accounts/client
```

## Usage

```js
import { AccountsClient } from '@accounts/client';

const accountsTransport = // my accounts-js transport, rest or graphql
const accounts = new AccountsClient({
  // options
}, accountsTransport);
```
