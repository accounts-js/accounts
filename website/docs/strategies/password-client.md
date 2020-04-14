---
id: password-client
title: Password client
sidebar_label: Client
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/client-password) |
[npm](https://www.npmjs.com/package/@accounts/client-password)

## Install

Add `@accounts/client-password` to your app with yarn or npm:

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

## Use cases

The `@accounts/client-password` module exposes a set of methods that can be used in any JavaScript framework.

### Create user

Create a new account for the user.

```javascript
await accountsPassword.createUser({
  email: user.email,
  password: user.password,
  // You can also add some custom fields
});
```

### Change password

Change the current user's password. Must be logged in.

```javascript
await accountsPassword.changePassword('oldPassword', 'newPassword');
```

### Forgot password

In order to reset a user password, the first step is to send an email to the user, containing a random secret. Then your application needs to send this token to the server along with the new password.

```javascript
// Request a forgot password email
await accountsPassword.requestPasswordReset('email');
// Reset the password for a user using a token received in email
await accountsPassword.resetPassword('token', 'newPassword');
```

### Verify email

When a user is created, his email will be marked as unverified. To verify the user email, the first step is to send him an email containing a random secret. Then your application needs to send this token to the server to verify the email of the user.

```javascript
// Send an email with a link the user can use verify their email address.
await accountsPassword.requestVerificationEmail('email');
// Marks the user's email address as verified using a token received in email
await accountsPassword.verifyEmail('token');
```

### Add another email

Add an email address for a user. Must be logged in.

```javascript
await accountsPassword.addEmail('newEmail');
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
  hashPassword: (password) => {
    // Here we hash the password on the client before it's sent to the server
    const hashedPassword = SHA256(password);
    return hashedPassword.toString();
  },
});
```

Now when you login or create a user using `accountsPassword` the password will be hashed on the client so it won't be sent in plaintext to the server.
