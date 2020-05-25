---
id: mongo
title: Mongo
sidebar_label: Mongo
---

A accounts-js database adapter for [MongoDB](https://www.mongodb.com/)

[View source code for @accounts/mongo.](https://github.com/accounts-js/accounts/tree/master/packages/database-mongo)

## Installation

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

const accountsMongo = new Mongo(db, {
  // options
});
const accountsServer = new AccountsServer(
  { db: accountsMongo },
  {
    // services
  }
);

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

const accountsMongo = new Mongo(db, {
  // options
});
const accountsServer = new AccountsServer(
  { db: accountsMongo },
  {
    // services
  }
);

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

You can use the following options to configure the `@accounts/mongo` behavior.

```typescript
interface AccountsMongoOptions {
  /**
   * The users collection name.
   * Default 'users'.
   */
  collectionName?: string;
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
   * Should the user collection use _id as string or ObjectId.
   * Default 'true'.
   */
  convertUserIdToMongoObjectId?: boolean;
  /**
   * Should the session collection use _id as string or ObjectId.
   * Default 'true'.
   */
  convertSessionIdToMongoObjectId?: boolean;
  /**
   * Perform case intensitive query for user name.
   * Default 'true'.
   */
  caseSensitiveUserName?: boolean;
  /**
   * Function that generate the id for new objects.
   */
  idProvider?: () => string | object;
  /**
   * Function that generate the date for the timestamps.
   * Default to `(date?: Date) => (date ? date.getTime() : Date.now())`.
   */
  dateProvider?: (date?: Date) => any;
}
```

## Example using GraphQL

A working example is available [here](https://github.com/accounts-js/accounts/tree/master/examples/graphql-server-typescript).

## Example using Rest

A working example is available [here](https://github.com/accounts-js/accounts/tree/master/examples/react-rest-typescript).
