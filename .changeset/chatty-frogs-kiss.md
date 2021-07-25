---
'@accounts/client': minor
'@accounts/client-magic-link': minor
'@accounts/database-manager': minor
'@accounts/mongo': minor
'@accounts/mongo-magic-link': minor
'@accounts/typeorm': minor
'@accounts/graphql-api': minor
'@accounts/graphql-client': minor
'@accounts/magic-link': minor
'@accounts/rest-client': minor
'@accounts/rest-express': minor
'@accounts/server': minor
'@accounts/types': minor
---

Add support for magic-link strategy 🎉.

Installation:

```sh
yarn add @accounts/magic-link
```

Usage:

```js
import AccountsMagicLink from '@accounts/magic-link';

const accountsMagicLink = new AccountsMagicLink({});

const accountsServer = new AccountsServer(
  { db: accountsDb, tokenSecret: 'secret' },
  {
    magicLink: accountsMagicLink,
  }
);
```
