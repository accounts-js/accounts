---
id: password-client
title: Password client
sidebar_label: Client
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/client-password) |
[npm](https://www.npmjs.com/package/@accounts/client-password)

## Install

```
# With yarn
yarn add @accounts/client-password

# Or if you use npm
npm install @accounts/client-password --save
```

## Usage

```javascript
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';

const accountsClient = new AccountsClient({}, myTransport);
const accountsPassword = new AccountsClientPassword(accountsClient);
```

## Hashing the password client side

⚠️ If your app is using https you probably don't need this since it won't add more security to your app. But if your app isn't using SSL you should really consider using client side hashing of the password to protect your users! But remember that every production app that handles user data should run with SSL.

> This option was included in accounts-js by default until version `0.18.0`.

First you will need to install the `crypto-js` npm library:

```
# With yarn
yarn add crypto-js

# Or if you use npm
npm install crypto-js --save
```

Then setup the `hashPassword` option:

```javascript
import { SHA256 } from 'crypto-js';
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';

const accountsClient = new AccountsClient({});
const accountsPassword = new AccountsClientPassword(accountsClient, {
  hashPassword: password => {
    // Here we hash the password on the client before it's sent to the server
    const hashedPassword = SHA256(password);
    return hashedPassword.toString();
  },
});
```

Now when you login or create a user using `accountsPassword` the password will be hashed on the client so it won't be sent in plaintext to the server.
