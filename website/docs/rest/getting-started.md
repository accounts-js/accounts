---
id: getting-started
title: Getting started with Express
sidebar_label: Getting started
---

accounts-js provide an [Express](https://expressjs.com/) adapter to help you adding the REST API to your app.
We expose a set of routes to allow you to interact with it. These routes are generated based on the services you use. In this chapter, we assume that you have a basic understanding of the Express API.

In this guide we will setup a basic Express server and expose accounts-js function via a REST API. We will setup an email password based authentication, and use mongodb as a database to store our users.

## Setup express

Let's get started by adding the required packages we need

```
yarn add express body-parser
```

Once the packages are installed, we can setup the express server. If you are adding accounts-js in your app and your express server is already setup you can skip this step.

```typescript
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000);
```

## Setup mongoose

To setup mongoose and connect to our database, we first need to install the dependencies we need.

TODO link to the @accounts/mongo doc to show the options

```
yarn add @accounts/mongo mongoose
```

In our file, add the following code.

```typescript
import mongoose from 'mongoose';
import { Mongo } from '@accounts/mongo';

// We connect mongoose to our local mongodb database
mongoose.connect('mongodb://localhost:27017/accounts-js-server', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We tell accounts-js to use the mongo connection
const accountsMongo = new Mongo(mongoose.connection);
```

## Setup accounts-js server

Our application database connection is now done, it's now time to setup the accounts-js server.

```
yarn add @accounts/server @accounts/password
```

- **@accounts/server**: The accounts-js core dependency, it expose a set of functions to manage the sessions.
- **@accounts/password**: The accounts-js password service, it expose a set of function to manage and authenticate users using email + password.

In our file, add the following code.

```typescript
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';

// We create our email password service that will be used by the server
const accountsPassword = new AccountsPassword({
  // You can customise the behavior of the password service by providing some options
});

const accountsServer = new AccountsServer(
  {
    // We link the mongo adapter we created in the previous step to the server
    db: accountsMongo,
    // Replace this value with a strong random secret, it will be used to generate the JWT
    tokenSecret: 'my-super-random-secret',
  },
  {
    // We link the password service
    password: accountsPassword,
  }
);
```

## Setup the REST API

TODO

## Configuration

TODO show possible options

## Available routes

TODO in a separate page

## Errors

TODO

## Client

TODO in a separate page

```

```
