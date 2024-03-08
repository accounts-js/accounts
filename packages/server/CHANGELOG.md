# @accounts/server

## 1.0.0

### Major Changes

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Add option to require email verification

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Upgrade graphql-modules to v3 alpha

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Fix ambiguousErrorMessages and enableAutologin relationship

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Rearchitect accounts.js to better take advantage of graphql-modules

### Minor Changes

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Switch from pnpm to yarn4

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Upgrade graphql to v16

### Patch Changes

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Upgrade lodash to 4.17

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Upgrade jsonwebtoken to v9

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Upgrade emittery to 0.13

## 0.33.1

### Patch Changes

- [#1173](https://github.com/accounts-js/accounts/pull/1173) [`1cf53c32`](https://github.com/accounts-js/accounts/commit/1cf53c3283cf1e058de090aa6c5d6b258b6740c5) Thanks [@pradel](https://github.com/pradel)! - `emailTemplates` option can now be set partially

* [#1170](https://github.com/accounts-js/accounts/pull/1170) [`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda) Thanks [@pradel](https://github.com/pradel)! - Upgrade tslib to 2.3.0

* Updated dependencies [[`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda)]:
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
  import AccountsMagicLink from "@accounts/magic-link";

  const accountsMagicLink = new AccountsMagicLink({});

  const accountsServer = new AccountsServer(
    { db: accountsDb, tokenSecret: "secret" },
    {
      magicLink: accountsMagicLink,
    },
  );
  ```

* [#1130](https://github.com/accounts-js/accounts/pull/1130) [`d29e91a6`](https://github.com/accounts-js/accounts/commit/d29e91a65215d08bda79eab1f7b142b615160241) Thanks [@pradel](https://github.com/pradel)! - Update emittery dependency from v5.1 to v8.1 - Drop support for Node.js 8

### Patch Changes

- Updated dependencies [[`22056642`](https://github.com/accounts-js/accounts/commit/220566425755a7015569d8e518095701ff7122e2)]:
  - @accounts/types@0.33.0
