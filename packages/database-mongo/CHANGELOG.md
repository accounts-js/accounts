# @accounts/mongo

## 0.33.5

### Patch Changes

- [#1170](https://github.com/accounts-js/accounts/pull/1170) [`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda) Thanks [@pradel](https://github.com/pradel)! - Upgrade tslib to 2.3.0

- Updated dependencies [[`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda), [`975ced7d`](https://github.com/accounts-js/accounts/commit/975ced7d796a75add425120c83152cf262a7bdf0)]:
  - @accounts/mongo-magic-link@0.1.1
  - @accounts/mongo-password@0.32.2
  - @accounts/mongo-sessions@0.32.2
  - @accounts/types@0.33.1

## 0.33.4

### Patch Changes

- [`1afdb00a`](https://github.com/accounts-js/accounts/commit/1afdb00aa9078eb40ddbe51e8916ac3d76e66aef) Thanks [@pradel](https://github.com/pradel)! - Fix 0.33.3 not properly published.

## 0.33.3

### Patch Changes

- [`e9fd5026`](https://github.com/accounts-js/accounts/commit/e9fd5026f3c713878ec8088373fc213733b1f1a1) Thanks [@pradel](https://github.com/pradel)! - Fix 0.33.2 not properly published.

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
