# @accounts/password

[![npm](https://img.shields.io/npm/v/@accounts/password.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/password)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
yarn add @accounts/password
```

## Usage

```js
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';

export const accountsPassword = new AccountsPassword({
  // options
});

const accountsServer = new AccountsServer(
  {
    // options
  },
  {
    password: accountsPassword,
  }
);
```
