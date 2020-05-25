---
id: server
title: Server
sidebar_label: Server
---

[Github](https://github.com/accounts-js/accounts/tree/master/packages/server) |
[npm](https://www.npmjs.com/package/@accounts/server)

## Install

Add `@accounts/server` to your app with yarn or npm:

```
# With yarn
yarn add @accounts/server

# Or if you use npm
npm install @accounts/server --save
```

## Usage

```javascript
import { AccountsServer } from '@accounts/server';

const accountsServer = new AccountsServer(
  {
    // The database adapter used for the users and sessions
    db: ...,
    // A strong random secret
    tokenSecret: 'SECRET',
  },
  {
    // List of services to use with the server
  }
);
```

## Use cases

The `@accounts/server` module exposes a set of methods that can be used directly in your server code.

### Find a user

Find a user by his id.

```javascript
const user = await accountsServer.findUserById(userId);
// user will contain the user object or will be null if the user was not found
```

### Login a user manually

```javascript
// Service we want to use for the authentication (password, oauth...)
const serviceName = 'password';

const params = {
  // params used to authenticate the user
};

const loginResult = await accountsServer.loginWithService(serviceName, params, {
  // connection informations, like ip, user agent etc..
});
/**
 * loginResult will have the following type
 * {
 *   sessionId: string;
 *   tokens: {
 *     accessToken: string;
 *     refreshToken: string;
 *   };
 *   user: User;
 * }
 */
```

### Creating a new session for a user

⚠️ This method creates a session without authenticating any user identity. Any authentication should happen before calling this function.

```javascript
const user = await accountsServer.findUserById(userId);

const loginResult = await accountsServer.loginWithUser(user, {
  // connection informations, like ip, user agent etc..
});
/**
 * loginResult will have the following type
 * {
 *   sessionId: string;
 *   tokens: {
 *     accessToken: string;
 *     refreshToken: string;
 *   };
 *   user: User;
 * }
 */
```

### Deactivate a user

Deactivate a user, the user will not be able to login until his account is reactivated.

```javascript
await accountsServer.deactivateUser(userId);
```

### Activate a user

Activate a user. Use this method to unblock a user account that was previously deactivated.

```javascript
await accountsServer.activateUser(userId);
```

### Logout a user

Logout a user and invalidate his session with the session access token.

```javascript
await accountsServer.logout(accessToken);
```

## Customising the JWT payload

When creating the JWT accessToken, accounts-js will add the following properties: `userId`, `isImpersonated`. If you want to add your own data to the payload (eg: roles or other), you can do it using the `createJwtPayload` option.

```javascript
const accountsServer = new AccountsServer({
  createJwtPayload: async (data, user) => {
    // data is the accounts-js payload
    // user is an object containing the user fetched from the db

    // Do your own logic, for example to add the user role in the JWT payload you could do the following
    return {
      role: user.isAdmin ? 'admin' : 'user',
    };
  },
});
```
