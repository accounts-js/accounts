# @accounts/graphql-client

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
