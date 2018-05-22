# @accounts/express-session

Stores the access and refresh tokens as part of the session (`express-session`), this way auth flow could be based on it.

[![npm](https://img.shields.io/npm/v/@accounts/express-session.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/express-session)
[![CircleCI](https://circleci.com/gh/accounts-js/express-session.svg?style=shield)](https://circleci.com/gh/accounts-js/express-session)
[![codecov](https://codecov.io/gh/accounts-js/express-session/branch/master/graph/badge.svg)](https://codecov.io/gh/accounts-js/express-session)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
yarn add @accounts/express-session
```

## Usage

```ts
import * as express from 'express';
import * as session from 'express-session';
import { Tokens } from '@accounts/types';
import { AccountsSession } from '@accounts/express-session';
import { accountsServer } from './setup';

const accountsSession = new AccountsSession(accountsServer, {
  user: {
    name: 'currentUser',
    resolve: (tokens: Tokens) => {
      // function that returns a user object
    }
  }
});

const app = express();

app.use(
  session({
    name: 'id',
    secret: 'secret',
    rolling: true,
    cookie: { ... }, // cookie options
  })
);

app.use(accountsSession.middleware())

app.get('/me', (req, res) => {
  const user = req.currentUser; // middleware assings a user object to `req`

  res.json(user);
});

app.post('/login', (req, res) => {
  let tokens: Tokens; // Tokens  AccountsServer

  // ... a logic to log user in

  accountsSession.set(req, tokens); // sets tokens on request so middleware can access that
});

app.get('/logout', (req, res) => {
  accountsSession.destroy(req); // destroys the session and logs user out
});
```

## Options

#### user.name

Specifies the name of a property that holds a user object. For example, By using `currentUser`, a user object is accesible on `req.currentUser`.

By default it uses: `user`

#### user.resolve

Function that receives an access and a refresh tokens to resolve a user object.

```
(tokens: Tokens) => User | Promise<User>
```

By default it uses AccountsServer's API to resolve a user.

#### name

Specifies the name of a property that holds the Tokens. For example, By using `tokens`, tokens are accesible on `req.tokens`.

By default it uses: `accounts-js-tokens`

## License

MIT
