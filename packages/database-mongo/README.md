# @accounts/mongo

_MongoDB adaptor for accounts_

[![npm](https://img.shields.io/npm/v/@accounts/mongo.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/mongo)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Note

This package is under active development.

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

The users will be saved under the `users` collection.

## Setup mongodb indexes

It's really important that your production database have the necessary mongodb indexes in order to perform fast queries.

To do so, when your server is booting, run the following command:

```javascript
await accountsMongo.setupIndexes();
```
