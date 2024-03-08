# @accounts/mongo-sessions

## 1.0.0

### Major Changes

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Rearchitect accounts.js to better take advantage of graphql-modules

### Minor Changes

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Switch from pnpm to yarn4

- [#1258](https://github.com/accounts-js/accounts/pull/1258) [`da13d0d`](https://github.com/accounts-js/accounts/commit/da13d0dc96f05b83f28d5d367d1dc96a00210bf8) Thanks [@darkbasic](https://github.com/darkbasic)! - Upgrade mongodb to v6

## 0.34.0

### Minor Changes

- [#1251](https://github.com/accounts-js/accounts/pull/1251) [`3f1c4945`](https://github.com/accounts-js/accounts/commit/3f1c4945526f27bdb51bf80ef65bcde6f9b033ed) Thanks [@awatson1978](https://github.com/awatson1978)! - MongoDB 4.X support for Meteor@2.5.1 - Mongo.createUser and Mongo.createSession bugfixes

## 0.33.0

### Minor Changes

- [#1205](https://github.com/accounts-js/accounts/pull/1205) [`dc13f582`](https://github.com/accounts-js/accounts/commit/dc13f5827e7577d7825f5eaae1b87eea2055f0da) Thanks [@mrcleanandfresh](https://github.com/mrcleanandfresh)! - Changed `idProvider` to `idSessionProvider` in `@mongo-sessions`. This change was made to give more granular control when creating custom identifiers for both sessions and users. The new option generates the \_id for new Session objects. Going forward, the `idProvider` will only be used for the creation of user identifiers.

  Updated `AccountsMongoOptions` in `@mongo` to have the new `idSessionProvider`.

  **Migration:** If you are using `idProvider` for the creation of a custom identifier for sessions, then you will need to move that logic to the new `idSessionProvider` function in the configuration.

### Patch Changes

- [#1205](https://github.com/accounts-js/accounts/pull/1205) [`dc13f582`](https://github.com/accounts-js/accounts/commit/dc13f5827e7577d7825f5eaae1b87eea2055f0da) Thanks [@mrcleanandfresh](https://github.com/mrcleanandfresh)! - The configuration option of convertSessionIdToMongoObjectId is now checked when using idProvider

## 0.32.2

### Patch Changes

- [#1170](https://github.com/accounts-js/accounts/pull/1170) [`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda) Thanks [@pradel](https://github.com/pradel)! - Upgrade tslib to 2.3.0

* [#1180](https://github.com/accounts-js/accounts/pull/1180) [`975ced7d`](https://github.com/accounts-js/accounts/commit/975ced7d796a75add425120c83152cf262a7bdf0) Thanks [@rawb1](https://github.com/rawb1)! - Fix compatibility issue with MongoDB 4.X

* Updated dependencies [[`e81eb578`](https://github.com/accounts-js/accounts/commit/e81eb578b35906346b6fadd6c5768b82879f6cda)]:
  - @accounts/types@0.33.1

## 0.32.1

### Patch Changes

- Updated dependencies [[`22056642`](https://github.com/accounts-js/accounts/commit/220566425755a7015569d8e518095701ff7122e2)]:
  - @accounts/types@0.33.0
