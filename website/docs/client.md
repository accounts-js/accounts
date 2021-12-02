---
id: client
title: Client
sidebar_label: Client
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/client) |
[npm](https://www.npmjs.com/package/@accounts/client)

## Install

Add `@accounts/client` to your app with yarn or npm:

```
# With yarn
yarn add @accounts/client

# Or if you use npm
npm install @accounts/client --save
```

## Usage

```javascript
import { AccountsClient } from '@accounts/client';

const accountsClient = new AccountsClient({}, myTransport);
```

## Use cases

The `@accounts/client` module exposes a set of methods that can be used in any JavaScript framework.

### Login

Login the user with a specific service.

```javascript
await accountsClient.loginWithService('serviceName', credentials);

// For example with the password service
await accountsClient.loginWithService('password', {
  user: {
    email: values.email,
  },
  password: values.password,
});
```

### Logout

Logout the user.

```javascript
// For example with the password service
await accountsClient.logout();
```

### Retrieve the current authenticated user

Will return the current logged in user informations.
Must be logged in.

```javascript
// For example with the password service
await accountsClient.getUser();
```

### Impersonating another user

If you need to you can allow some users via [server authorization](/docs/server#authorize-to-impersonate) to impersonate the other users accounts, e.g.: Only admin users can impersonate to other users.
Your current session will be replaced by [another impersonated session](/docs/server#check-if-session-is-impersonated).
Must be logged in.

```javascript
await accountsClient.impersonate({ userId: 'userId' });

// When you are done, you must stop the impersonation process
// Your other session will be restored
await accountsClient.stopImpersonation();
```
