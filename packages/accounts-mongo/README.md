# @accounts/mongo

*MongoDB adaptor for accounts*

[![npm](https://img.shields.io/npm/v/@accounts/mongo.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/mongo) [![Circle CI](https://circleci.com/gh/accounts-js/mongo.svg?style=shield)](https://circleci.com/gh/accounts-js/mongo) [![Coverage Status](https://coveralls.io/repos/github/accounts-js/mongo/badge.svg?branch=master)](https://coveralls.io/github/accounts-js/mongo?branch=master) ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Note

This package is under active development.

## Install
```
yarn add @accounts/mongo
```

## Usage

```javascript
import AccountsServer from '@accounts/server';
import MongoDBInterface from '@accounts/mongo';

// If you are using mongoose
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

// If you are using mongodb
const db =  await mongodb.MongoClient.connect(process.env.MONGO_URL);

AccountsServer.config({
}, new MongoDBInterface(db));
```

The users will be saved under the `users` collection.
