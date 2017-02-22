# @accounts/graphql-api

*Server side GraphQL transport for accounts*

[![npm](https://img.shields.io/npm/v/@accounts/graphql-api.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/graphql-api) [![Circle CI](https://circleci.com/gh/js-accounts/graphql-api.svg?style=shield)](https://circleci.com/gh/js-accounts/graphql-api) [![Coverage Status](https://coveralls.io/repos/github/js-accounts/graphql-api/badge.svg?branch=master)](https://coveralls.io/github/js-accounts/graphql-api?branch=master) ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Note
This package is under active development and is just starting to form a structure.
Currently the package holds it's own express server.
After some work is done, it will require an express app to be supplied.
Ideally, it would not matter weather it is express or other network transport altogether.

## Start dev server

```bash
yarn
yarn start
```

## Generate flow types from graphql schema

While server is running
```bash
yarn typify
```
