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

Find a user by their id.

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

Deactivate a user, the user will not be able to login until their account is reactivated.

```javascript
await accountsServer.deactivateUser(userId);
```

### Activate a user

Activate a user. Use this method to unblock a user account that was previously deactivated.

```javascript
await accountsServer.activateUser(userId);
```

### Logout a user

Logout a user and invalidate their session with the session access token.

```javascript
await accountsServer.logout(accessToken);
```

### Authorize to impersonate

If you want to restrict impersonation to specific users, you have to set up the `impersonationAuthorize` property of `AccountsServer`.

```javascript
new AccountsServer(
  {
    ...
    impersonationAuthorize: async (user, impersonateToUser) {
      // Put your authorization logic in here
      // E.g. your user has a role property and only admins should be allowed to impersonate:
      if(user.role === 'admin')
        return true;

      return false;
    },
  },
  ...
);
```

### Check if session is impersonated

On the server you can check, if a request is done by an impersonated user by inspecting the session for the `extraData` property.
There you may have `impersonatorUserId`. This is the `id` of the user who impersonates.

```javascript
const accountsContext = await accountsGraphQL.context(networkSession);
const session = await accountsServer.findSessionByAccessToken(accountsContext.authToken);

/**
 * session will have the following type
 * {
 *   id: string;
 *   userId: string;
 *   token: string;
 *   valid: boolean;
 *   userAgent?: string | null;
 *   ip?: string | null;
 *   createdAt: string;
 *   updatedAt: string;
 *   extraData?: { impersonatorUserId?: string };  <---
 * }
 */
```

## Session

accounts-js use [JWT](https://jwt.io/introduction/) to implement authentication via tokens.

A session is represented by a pair of access-token and refresh-token strings:

- The access-token is a short-lived token that is sent along with every request to verify the identity of the user.
- The refresh-token is a long-lived token that is used to get a new access-token after the previous one becomes expired.

### Stateful session

This is the default behavior of the accounts-js server. On every request, the validity will be checked against the database. This allows you to revoke a session at any time. We recommend using the Redis database adapter to store the sessions as the check will be done faster.

### Stateless session

Since we are using JWT you can decide to have a stateless session. This means that the token won't be checked against the database on every request. Using the stateless approach will make the server authorisation check faster but this means that you won't be able to able to invalidate the access token until it's expired.

Set the `useStatelessSession` to `true` on the accounts-js server if you want to enable this behavior.

```ts
const accountsServer = new AccountsServer({
  useStatelessSession: true,
});
```

:::caution
Only use this option if you understand the downsides of this approach.
:::

### Debugging a JWT token

To debug a JWT token you can use the [JWT debugger](https://jwt.io/#debugger-io) and paste your token in the "Generated" input. On the right side, you will be able to see the payload that your token contains.

### Customising the JWT payload

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

### Revoking all the sessions for a user

After a session is invalidated, the access-token can't be used to authenticate the user (unless you are using the `useStatelessSession` option) and the refresh-token can't be used to get a new token.

To invalidate all the open sessions for a user, call the following method against your accounts-js database adapter:

```ts
accountsDatabase.invalidateAllSessions('userId');
```

The user will need to reauthenticate to get a new access and refresh token.
