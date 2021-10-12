# @accounts/graphql-client

## 0.33.1

### Patch Changes

- [#1163](https://github.com/accounts-js/accounts/pull/1163) [`926b4217`](https://github.com/accounts-js/accounts/commit/926b421710b134ed79272e5468b31e417708a3c4) Thanks [@pradel](https://github.com/pradel)! - Upgrade graphql-codegen packages

* [#1170](https://github.com/accounts-js/accounts/pull/1170) [`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda) Thanks [@pradel](https://github.com/pradel)! - Upgrade tslib to 2.3.0

* Updated dependencies [[`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda)]:
  - @accounts/client@0.33.1
  - @accounts/types@0.33.1

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

- [#1136](https://github.com/accounts-js/accounts/pull/1136) [`217004de`](https://github.com/accounts-js/accounts/commit/217004deefc1a5b52e3aeb83f5f9b3c58ab68554) Thanks [@pradel](https://github.com/pradel)! - Upgrade dependencies

- Updated dependencies [[`22056642`](https://github.com/accounts-js/accounts/commit/220566425755a7015569d8e518095701ff7122e2)]:
  - @accounts/client@0.33.0
  - @accounts/types@0.33.0
