# @accounts/graphql-api

## 0.33.2

### Patch Changes

- [#1194](https://github.com/accounts-js/accounts/pull/1194) [`a4fd732d`](https://github.com/accounts-js/accounts/commit/a4fd732d50a3847f86254da413d27a5684417abd) Thanks [@zenweasel](https://github.com/zenweasel)! - Fix repo links in package.json

* [#1203](https://github.com/accounts-js/accounts/pull/1203) [`0a402215`](https://github.com/accounts-js/accounts/commit/0a402215978b432ce792b125050765f6bbb0fd7c) Thanks [@mrcleanandfresh](https://github.com/mrcleanandfresh)! - Added additional examples for how to authenticate with @accounts/graphql-api

## 0.33.1

### Patch Changes

- [#1163](https://github.com/accounts-js/accounts/pull/1163) [`926b4217`](https://github.com/accounts-js/accounts/commit/926b421710b134ed79272e5468b31e417708a3c4) Thanks [@pradel](https://github.com/pradel)! - Upgrade graphql-codegen packages

* [#1170](https://github.com/accounts-js/accounts/pull/1170) [`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda) Thanks [@pradel](https://github.com/pradel)! - Upgrade tslib to 2.3.0

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

- [#1135](https://github.com/accounts-js/accounts/pull/1135) [`304cc18d`](https://github.com/accounts-js/accounts/commit/304cc18d84d8153b7a4e857753eea85fa9f7a1f2) Thanks [@pradel](https://github.com/pradel)! - Upgrade dependencies

* [#1137](https://github.com/accounts-js/accounts/pull/1137) [`7726eaf7`](https://github.com/accounts-js/accounts/commit/7726eaf7fb12eb848de5dab0913a12a2e0283954) Thanks [@pradel](https://github.com/pradel)! - Fix `accountsGraphQL.context` breaking apollo subscriptions.
