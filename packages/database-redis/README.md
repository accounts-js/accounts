# @accounts/redis

_Redis adaptor for accounts_

[![npm](https://img.shields.io/npm/v/@accounts/redis.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/redis)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
yarn add @accounts/redis
```

## Usage

```javascript
import IORedis from 'ioredis';

import { AccountsServer } from '@accounts/server';
import { DatabaseManager } from '@accounts/database-manager';
import { RedisSessions } from '@accounts/redis';

const ioRedis = new IORedis();

const sessionDb = new RedisSessions(ioRedis, {
  ...options,
});

const accountsDb = new DatabaseManager({
  sessionStorage: sessionDb,
});

const accountsServer = new AccountsServer({ db: accountsDb });
```
