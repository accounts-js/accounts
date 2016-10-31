# accounts

*Fullstack authentication and accounts-management for GraphQL and REST*

[![npm](https://img.shields.io/npm/v/js-accounts.svg?maxAge=2592000)](https://www.npmjs.com/package/graphql-accounts) [![Circle CI](https://circleci.com/gh/graphql-accounts/graphql-accounts.svg?style=shield)](https://circleci.com/gh/graphql-accounts/graphql-accounts) [![Coverage Status](https://coveralls.io/repos/github/graphql-accounts/graphql-accounts/badge.svg?branch=master)](https://coveralls.io/github/graphql-accounts/graphql-accounts?branch=master) ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

Copyright (c) 2016 by Gadi Cohen & Tim Mikeladze.  Released under the MIT license.

## Getting Started

Install the core package.

```
npm i -S @accounts/accounts
```

Next install the package based on the the type of transport you are using. We support GraphQL and REST.

```
npm i -S @accounts/graphql
npm i -S @accounts/rest
```

Finally you'll need a data store adapter. We support the following data stores.

- [ ] Mongo
- [ ] MySQL

```
npm i -S @accounts/mongo
npm i -S @accounts/sql
```
