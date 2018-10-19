---
id: rest
title: REST
sidebar_label: Rest
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/rest-express) |
[npm](https://www.npmjs.com/package/@accounts/rest-express)

_REST server for accounts-js_

## Express

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

## Client

### Install

```
yarn add @accounts/rest-client
```

### Usage

```javascript
import { AccountsClient } from '@accounts/client';
import { RestClient } from '@accounts/rest-client';

const accountsRest = new RestClient({
  apiHost: 'http://localhost:4000',
  rootPath: '/accounts',
});
const accounts = new AccountsClient({}, accountsRest);
```

### Options

```javascript
const options = {
  apiHost: string,
  // Path that prefix the accounts-js routes
  rootPath: string,
};
```
