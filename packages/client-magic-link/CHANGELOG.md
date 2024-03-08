# @accounts/client-magic-link

## 1.0.0

### Major Changes

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Rearchitect accounts.js to better take advantage of graphql-modules

### Minor Changes

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Switch from pnpm to yarn4

## 0.1.1

### Patch Changes

- [#1170](https://github.com/accounts-js/accounts/pull/1170) [`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda) Thanks [@pradel](https://github.com/pradel)! - Upgrade tslib to 2.3.0

- Updated dependencies [[`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda)]:
  - @accounts/client@0.33.1
  - @accounts/types@0.33.1

## 0.1.0

### Minor Changes

- [#1150](https://github.com/accounts-js/accounts/pull/1150) [`22056642`](https://github.com/accounts-js/accounts/commit/220566425755a7015569d8e518095701ff7122e2) Thanks [@larsivi](https://github.com/larsivi)! - Add support for magic-link strategy 🎉.

  Installation:

  ```sh
  yarn add @accounts/magic-link
  ```

  Usage:

  ```js
  import AccountsMagicLink from "@accounts/magic-link";

  const accountsMagicLink = new AccountsMagicLink({});

  const accountsServer = new AccountsServer(
    { db: accountsDb, tokenSecret: "secret" },
    {
      magicLink: accountsMagicLink,
    },
  );
  ```

### Patch Changes

- Updated dependencies [[`22056642`](https://github.com/accounts-js/accounts/commit/220566425755a7015569d8e518095701ff7122e2)]:
  - @accounts/client@0.33.0
  - @accounts/types@0.33.0
