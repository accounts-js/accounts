# @accounts/client-password

[![npm](https://img.shields.io/npm/v/@accounts/client-password.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/client-password)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
yarn add @accounts/client-password
```

## Usage

```js
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';

const accounts = new AccountsClient({}, accountsTransport);
const accountsPassword = new AccountsClientPassword(accounts);
```
