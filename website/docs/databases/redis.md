---
id: redis
title: Redis
sidebar_label: Redis
---

A database adapter for [Redis](https://redis.io/)

> For now `@accounts/redis` only provide a session storage, you will need to use another connector for the user storage.

[View source code for @accounts/redis.](https://github.com/accounts-js/accounts/tree/master/packages/database-redis)

## Installation

```
yarn add @accounts/redis @accounts/database-manager ioredis
```

## Usage

In order to use the redis adaptor in your project, you will need to pass a valid redis connection to `@accounts/redis`:

```javascript
import { Redis } from 'ioredis';
import { AccountsServer } from '@accounts/server';
import { DatabaseManager } from '@accounts/database-manager';
import { RedisSessions } from '@accounts/redis';

const ioRedis = new Redis();

const accountsRedis = new RedisSessions(ioRedis, {
  // options
});

const accountsDb = new DatabaseManager({
  // You also need to provide the `userStorage` property linked to another database
  sessionStorage: accountsRedis,
});

const accountsServer = new AccountsServer(
  { db: accountsDb },
  {
    // services
  }
);
```

## Options

You can use the following options to configure the `@accounts/redis` behavior.

```typescript
interface AccountsRedisOptions {
  /**
   * The users collection name.
   * Default 'users'.
   */
  userCollectionName?: string;
  /**
   * The sessions collection name.
   * Default 'sessions'.
   */
  sessionCollectionName?: string;
  /**
   * The timestamps for the users and sessions collection.
   * Default 'createdAt' and 'updatedAt'.
   */
  timestamps?: {
    createdAt: string;
    updatedAt: string;
  };
  /**
   * Function that generate the id for new objects.
   * Default to shortid npm package `shortid.generate()`
   */
  idProvider?: () => string;
  /**
   * Function that generate the date for the timestamps.
   * Default to `(date?: Date) => (date ? date.getTime() : Date.now())`.
   */
  dateProvider?: (date?: Date) => any;
}
```
