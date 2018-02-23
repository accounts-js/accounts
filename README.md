# accounts

*Fullstack authentication and accounts-management for GraphQL and REST*

[![Backers on Open Collective](https://opencollective.com/accounts-js/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/accounts-js/sponsors/badge.svg)](#sponsors) [![npm](https://img.shields.io/npm/v/@accounts/server.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/accounts) [![CircleCI](https://circleci.com/gh/accounts-js/accounts.svg?style=svg)](https://circleci.com/gh/accounts-js/accounts) [![Coverage Status](https://coveralls.io/repos/github/accounts-js/accounts/badge.svg?branch=master)](https://coveralls.io/github/accounts-js/accounts?branch=master) ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Community

- Slack - accounts-js.slack.com
- [Meeting notes](https://github.com/accounts-js/accounts/blob/master/MEETINGS.md)

## Note

This package, along with the rest of the packages under the `accounts-js` organization are under active development and are **not** ready for consumption.

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

- [x] [Mongo](https://github.com/accounts-js/mongo)
- [x] [Redis](https://github.com/accounts-js/redis)
- [ ] [SQL](https://github.com/accounts-js/sql) with [sequelize](http://docs.sequelizejs.com/en/v3/)

```
npm i -S @accounts/mongo
npm i -S @accounts/redis
npm i -S @accounts/sql
```

## Example

You can find a working example [here](https://github.com/accounts-js/examples).

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

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/accounts-js/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/accounts-js#backer)]

<a href="https://opencollective.com/accounts-js#backers" target="_blank"><img src="https://opencollective.com/accounts-js/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/accounts-js#sponsor)]

<a href="https://opencollective.com/accounts-js/sponsor/0/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/accounts-js/sponsor/1/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/accounts-js/sponsor/2/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/accounts-js/sponsor/3/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/accounts-js/sponsor/4/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/accounts-js/sponsor/5/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/accounts-js/sponsor/6/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/accounts-js/sponsor/7/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/accounts-js/sponsor/8/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/accounts-js/sponsor/9/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/9/avatar.svg"></a>


