---
id: rest-client
title: Rest Client
sidebar_label: Client
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/rest-client) |
[npm](https://www.npmjs.com/package/@accounts/rest-client)

_REST client for accounts-js_

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
