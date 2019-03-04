---
title: Facebook
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/oauth-facebook) |
[npm](https://www.npmjs.com/package/@accounts/oauth-facebook)

_OAuth Facebook Strategy for accounts-js_

## Install

```
yarn add @accounts/oauth @accounts/oauth-facebook
```

## Usage

```javascript
import AccountsServer from '@accounts/server';
import AccountsOauth from '@accounts/oauth';
import AccountsOAuthFacebook from '@accounts/oauth-facebook';

const accountsOauth = new AccountsOauth({
  facebook: {
    key: 'your-facebook-client-id',
    secret: 'your-facebook-client-secret',
  },
));

const accountsServer = new AccountsServer(...config, {
  password: password,
  oauth: accountsOauth,
});
```
