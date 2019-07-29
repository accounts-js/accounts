---
title: Password
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/password) |
[npm](https://www.npmjs.com/package/@accounts/password)

The `@accounts/password` package provide a secure system for a password based login strategy.

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

### Extend the user with custom fields

TODO

### Multiple emails

TODO

### Email case sensitivity

Due to some databases limitations, we have to do some internal logic to ensure that emails and usernames are uniques.

⚠️ Never query your database directly when you want to query a user by username or email. Instead use the the `AccountsPassword.findUserByEmail` and `AccountsPassword.findUserByUsername` functions.
