# @accounts/redis

_Redis adaptor for accounts_

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
  ...options
});

const accountsDb = new DatabaseManager({
  sessionStorage: sessionDb
});

const accountsServer = new AccountsServer({ db: accountsDb });
```
