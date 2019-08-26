---
id: rest-express
title: Rest Express
sidebar_label: Express
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/rest-express) |
[npm](https://www.npmjs.com/package/@accounts/rest-express)

_REST server for accounts-js_

### Install

```
yarn add @accounts/rest-express
```

### Usage

```javascript
import express from 'express';
import AccountsServer from '@accounts/server';
import accountsExpress from '@accounts/rest-express';

const accountsServer = new AccountsServer(...);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(accountsExpress(accountsServer));

app.listen(3000);
```

### Options

```javascript
const options = {
  // Path that prefix the express routes for the accounts middleware
  path: string,
};

app.use(accountsExpress(accountsServer, accountsExpressOptions));
```
