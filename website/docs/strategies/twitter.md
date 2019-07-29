---
title: Twitter
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/oauth-twitter) |
[npm](https://www.npmjs.com/package/@accounts/oauth-twitter)

_OAuth Twitter Strategy for accounts-js_

## Install

```
yarn add @accounts/oauth @accounts/oauth-twitter
```

## Usage

```javascript
import AccountsServer from '@accounts/server';
import AccountsOauth from '@accounts/oauth';
import AccountsOAuthTwitter from '@accounts/oauth-twitter';

const accountsOauth = new AccountsOauth({
  twitter: {
    key: 'your-twitter-consumer-key',
    secret: 'your-twitter-consumer-secret',
  },
));

const accountsServer = new AccountsServer(...config, {
  password: password,
  oauth: accountsOauth,
});
```
