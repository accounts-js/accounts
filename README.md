# accounts

*Fullstack authentication and accounts-management for GraphQL and REST*

[![npm](https://img.shields.io/npm/v/@accounts/accounts.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/accounts) [![Circle CI](https://circleci.com/gh/js-accounts/accounts.svg?style=shield)](https://circleci.com/gh/js-accounts/accounts) [![Coverage Status](https://coveralls.io/repos/github/js-accounts/accounts/badge.svg?branch=master)](https://coveralls.io/github/js-accounts/accounts?branch=master) ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

Copyright (c) 2016 by Gadi Cohen & Tim Mikeladze.  Released under the MIT license.

## Note

This package, along with the rest of the packages under the `js-accounts` organization are under active development and are **not** ready for consumption.

## Getting Started

Install the core package.

```
npm i -S @accounts/server
```

Next install the package based on the the type of transport and the web framework you are using. We support GraphQL and REST for the transport and Express.

```
npm i -S @accounts/rest-express
```

Finally you'll need a data store adapter. We support the following data stores.

- [x] [Mongo](https://github.com/js-accounts/mongo)
- [x] [Redis](https://github.com/js-accounts/redis)
- [ ] [SQL](https://github.com/js-accounts/sql) with [sequelize](http://docs.sequelizejs.com/en/v3/)

```
npm i -S @accounts/mongo
npm i -S @accounts/redis
npm i -S @accounts/sql
```

## Example

You can find a working example [here](https://github.com/js-accounts/rest-example).

## Emails

Configuration:
```javascript
AccountsServer.config({
 siteUrl: 'https://my-app.com',
 email: // a valid email config object passed to emailjs
 // https://github.com/eleith/emailjs#example-usage---text-only-emails
 // You can handle the send of the emails by providing an optional sendMail function
 // sendMail: ({ from, to, text, html }): Promise<void>
});
```

To overwrite the email templates:
```javascript
AccountsServer.emailTemplates.from = 'my-app <no-reply@my-app.com>';
AccountsServer.emailTemplates.verifyEmail.subject = (user) => `Verify your account email ${user.profile.lastname}`;
AccountsServer.emailTemplates.verifyEmail.text = (user, url) => `To verify your account email please click on this link: ${url}`;
```

## Server Side Hooks

`@accounts/server` also exposes hooks, that let you know about actions that happened by the client. every action has a hook for success and error.

> Server side hooks does not effect the flow on the actions at all - it's just a notification.

> You can subscribe to each hook multiple time!

Pass for each hooks a callback function, and each hooks provides a different arguments.

The following hooks are available:

* `onLoginSuccess`: will call with the login result, an object with: `({ sessionId, user, tokens: { accessToken, refreshToken } })`
* `onLoginError`: the callback will call with the `AccountsError` object.
* `onLogoutSuccess`: will be caled with the logout result: `(user, session, accessToken)`
* `onLogoutError`: the callback will call with the `AccountsError` object.
* `onCreateUserSuccess`: will call with: `(userId, userObject)`
* `onCreateUserError`: the callback will call with the `AccountsError` object.
* `onResumeSessionSuccess`: will call with `(user, accessToken)`
* `onResumeSessionError`: the callback will call with the `AccountsError` object.
* `onRefreshTokensSuccess`: will call with: `({ sessionId, user, tokens: { accessToken, refreshToken } })`
* `onRefreshTokensError`: the callback will call with the `AccountsError` object.
* `onImpersonationSuccess`: will call with: `(originalUser, impersonationResult: { authorized, user, tokens: { refreshToken, accessToken }})`
* `onImpersonationError`: the callback will call with the `AccountsError` object.
