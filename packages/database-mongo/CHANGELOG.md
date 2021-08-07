# @accounts/mongo

## 0.33.2

### Patch Changes

- [`8f540588`](https://github.com/accounts-js/accounts/commit/8f540588cdd35b9c55fb4135b416f834f5073ef3) Thanks [@pradel](https://github.com/pradel)! - Fix 0.33.1 not properly published.

## 0.33.1

### Patch Changes

- [#1157](https://github.com/accounts-js/accounts/pull/1157) [`19031830`](https://github.com/accounts-js/accounts/commit/19031830e2e9630ff5264cfd22f5a2f8722112bf) Thanks [@Adel-ak](https://github.com/Adel-ak)! - Fix `collectionName` option not used properly.

## 0.33.0

### Minor Changes

- [#1150](https://github.com/accounts-js/accounts/pull/1150) [`22056642`](https://github.com/accounts-js/accounts/commit/220566425755a7015569d8e518095701ff7122e2) Thanks [@larsivi](https://github.com/larsivi)! - Add support for magic-link strategy 🎉.

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

### Patch Changes

- Updated dependencies [[`22056642`](https://github.com/accounts-js/accounts/commit/220566425755a7015569d8e518095701ff7122e2)]:
  - @accounts/mongo-magic-link@0.1.0
  - @accounts/types@0.33.0
  - @accounts/mongo-password@0.32.1
  - @accounts/mongo-sessions@0.32.1
