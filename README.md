# accounts

*Fullstack authentication and accounts-management for GraphQL and REST*

[![npm](https://img.shields.io/npm/v/@accounts/accounts.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/accounts) [![Circle CI](https://circleci.com/gh/js-accounts/accounts.svg?style=shield)](https://circleci.com/gh/js-accounts/accounts) [![Coverage Status](https://coveralls.io/repos/github/js-accounts/accounts/badge.svg?branch=master)](https://coveralls.io/github/js-accounts/accounts?branch=master) ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

Copyright (c) 2016 by Gadi Cohen & Tim Mikeladze.  Released under the MIT license.

## Note

This package, along with the rest of the packages under the `js-accounts` organization are under active development and are **not** ready for consumption.

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
