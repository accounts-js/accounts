# @accounts/typeorm

_TypeORM adaptor for accounts_

[![npm](https://img.shields.io/npm/v/@accounts/typeorm.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/typeorm)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Note

This package is under active development.

## Install

```
yarn add @accounts/typeorm
```

## Usage

```javascript
import { createConnection } from 'typeorm';
import { AccountsServer } from '@accounts/server';
import { AccountsTypeorm, entities } from '@accounts/typeorm';

createConnection({
  type: 'postgres',
  url: 'postgres://user@localhost:5432/dbname',
  entities,
}).then(() => {
  const accountsTypeorm = new Typeorm();
  const accountsServer = new AccountsServer({ db: accountsTypeorm });
});
```

## Options
