# @accounts/rest-express

## 1.0.0

### Major Changes

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Add option to require email verification

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Fix ambiguousErrorMessages and enableAutologin relationship

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Rearchitect accounts.js to better take advantage of graphql-modules

### Minor Changes

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Switch from pnpm to yarn4

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Implement validation in rest-express and password endpoints

### Patch Changes

- [#1273](https://github.com/accounts-js/accounts/pull/1273) [`67c77b0`](https://github.com/accounts-js/accounts/commit/67c77b06d2f2ee88c08174084ba17b1819656bc0) Thanks [@darkbasic](https://github.com/darkbasic)! - dependencies updates:

  - Updated dependency [`express@4.18.3` ↗︎](https://www.npmjs.com/package/express/v/4.18.3) (from `4.18.2`, in `dependencies`)

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Upgrade express to 4.18

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Upgrade request-ip to 3.3

- Updated dependencies [[`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8), [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8), [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8), [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8), [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8), [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8), [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8), [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8), [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8), [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8), [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8)]:
  - @accounts/magic-link@1.0.0
  - @accounts/password@1.0.0
  - @accounts/server@1.0.0

## 0.33.1

### Patch Changes

- [#1170](https://github.com/accounts-js/accounts/pull/1170) [`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda) Thanks [@pradel](https://github.com/pradel)! - Upgrade tslib to 2.3.0

- Updated dependencies [[`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda)]:
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

### Patch Changes

- Updated dependencies [[`22056642`](https://github.com/accounts-js/accounts/commit/220566425755a7015569d8e518095701ff7122e2)]:
  - @accounts/types@0.33.0
