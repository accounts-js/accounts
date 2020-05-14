---
id: mongo
title: Mongo
sidebar_label: Mongo
---

_MongoDB data store for accounts-js_

[Github](https://github.com/accounts-js/accounts/tree/master/packages/database-mongo) |
[npm](https://www.npmjs.com/package/@accounts/mongo)

## Install

```
yarn add @accounts/mongo
```

## Usage

In order to use the mongo adaptor in your project, you will need to pass a valid mongo connection to `@accounts/mongo`:

```javascript
import { MongoClient } from 'mongodb';
import { AccountsServer } from '@accounts/server';
import { Mongo } from '@accounts/mongo';

// If you are using mongodb 3.x
const client = await mongodb.MongoClient.connect(process.env.MONGO_URL);
const db = client.db('my-db-name');

// If you are using mongodb 2.x
const db = await mongodb.MongoClient.connect(process.env.MONGO_URL);

const accountsMongo = new Mongo(db, options);
const accountsServer = new AccountsServer({ db: accountsMongo });

// Will create the necessary mongo indexes
await accountsMongo.setupIndexes();
```

## Usage with mongoose

If you are using mongoose in your application, you can reuse the mongoose connection like this:

```javascript
import mongoose from 'mongoose';
import { AccountsServer } from '@accounts/server';
import { Mongo } from '@accounts/mongo';

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

const accountsMongo = new Mongo(db, options);
const accountsServer = new AccountsServer({ db: accountsMongo });

// Will create the necessary mongo indexes
await accountsMongo.setupIndexes();
```

## Setup mongodb indexes

It's really important that your production database have the necessary mongodb indexes in order to perform fast queries.

To do so, when your server is booting, run the following command:

```javascript
await accountsMongo.setupIndexes();
```

## Options

```typescript
interface AccountsMongoOptions {
  /**
   * The users collection name, default 'users'.
   */
  collectionName?: string;
  /**
   * The sessions collection name, default 'sessions'.
   */
  sessionCollectionName?: string;
  /**
   * The timestamps for the users and sessions collection, default 'createdAt' and 'updatedAt'.
   */
  timestamps?: {
    createdAt: string;
    updatedAt: string;
  };
  /**
   * Should the user collection use _id as string or ObjectId, default 'true'.
   */
  convertUserIdToMongoObjectId?: boolean;
  /**
   * Should the session collection use _id as string or ObjectId, default 'true'.
   */
  convertSessionIdToMongoObjectId?: boolean;
  /**
   * Perform case intensitive query for user name, default 'true'.
   */
  caseSensitiveUserName?: boolean;
  /**
   * Function that generate the id for new objects.
   */
  idProvider?: () => string | object;
  /**
   * Function that generate the date for the timestamps.
   */
  dateProvider?: (date?: Date) => any;
}
```
