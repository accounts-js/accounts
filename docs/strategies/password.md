---
title: 'Password'
---

[Github](https://github.com/accounts-js/accounts) |
[npm](https://www.npmjs.com/package/@accounts/password)

_Password Strategy for accounts-js_

## Install

```
yarn add @accounts/password
```

## Usage

```javascript
import AccountsServer from '@accounts/server';
import AccountsPassword from '@accounts/password';

const password = new AccountsPassword(...config);
const accountsServer = new AccountsServer(...config, {
  password: password,
});
```
