# @accounts/database-manager

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
  - @accounts/types@0.33.0
