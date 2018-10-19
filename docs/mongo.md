---
id: mongo
title: 'Mongo'
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

```javascript
import AccountsServer from '@accounts/server';
import MongoDBInterface from '@accounts/mongo';

// If you are using mongoose
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

// If you are using mongodb
import mongodb from 'mongodb';
const db = await mongodb.MongoClient.connect(process.env.MONGO_URL);

const accountsServer = new AccountsServer({
  db: new MongoDBInterface(db),
});
```

## Options

```javascript
// Optionnal object to pass to MongoDBInterface
const options = {
  // The users collection name, default 'users'
  collectionName: string,
  // The sessions collection name, default 'sessions'
  sessionCollectionName: string,
  // The timestamps for the users and sessions collection, default 'createdAt' and 'updatedAt'
  timestamps: {
    createdAt: string,
    updatedAt: string,
  },
  // Should the collection use _id as string or ObjectId, default 'true'
  convertUserIdToMongoObjectId: boolean,
  // Should the session collection use _id as string or ObjectId, default 'true'
  convertSessionIdToMongoObjectId: boolean,
  // Perform case intensitive query for user name, default 'true'
  caseSensitiveUserName: boolean,
};

new MongoDBInterface(db, options);
```
