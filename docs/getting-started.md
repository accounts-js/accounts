---
id: getting-started
title: Getting started
sidebar_label: Getting started
---

# Getting started

Welcome to the `@accounts` documentation. This suite of packages aims to provide the consumer an end to end authentication and accounts management solution, with a simple to start with interface while preserving options for configuration. These packages provide OAuth support for popular providers such as Instagram, Twitter, Github, two factor authentication, password based accounts along with recovery options and customizable account creation and validation.

## Installation

The `@accounts` packages are modular by nature and can be manually installed and configured, however we provide `@accounts/boost` - a package containing useful abstractions to get an accounts server started with minimal configuration.

## Quick install

**Install the core**

`npm install @accounts/boost`

**Choose your database database driver**

`npm install @accounts/mongo`

**Choose your authentication services**

`npm install @accounts/password`

The following starts an accounts server using the database, transport, and authentication services you provided with the default settings.

**Start the accounts server**

```javascript
import accountsBoost from `@accounts/boost`;

(async () => {

  const accounts = await accountsBoost({
    tokenSecret: 'your secret'
  }).listen();

})();
```

At this point you will have an accounts GraphQL server running at http://localhost:4003 with a GraphQL playground available at the same address.

Configuring additional options, such as providing custom connection options for a database or additional parameters based on your chosen packages can be achieved by supplying by passing an options object when initializing the `AccountsServer`.

Assuming you've installed the following packages, `@accounts/mongo` and `@accounts/password` the default mongo connection options will be applied and a database called `accounts-js` will be used.

Out of the box `@accounts/password` is preconfigured to allow users to sign up with usernames or email addresses.

<!-- Add a link to the options type definitions  -->

## Usage with existing GraphQL server

An existing GraphQL server can be extended with accounts functionality by calling the `AccountsServer.graphql()` function.

This function will return the type definitions, resolvers, schema directives, the accounts GraphQL context function used for authentication, and finally the executable GraphQL schema used by `AccountsServer.listen()`.

These variables should then be referenced when creating your GraphQL schema.

**Adding accounts to a GraphQL server**

```javascript
import accountsBoost from '@accounts/boost';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { ApolloServer } from 'apollo-server';
import { merge } from 'lodash';

const accountsGraphQL = new AccountsServer({
  tokenSecret: 'bad secret'
} as any).graphql();

const typeDefs = `
  type PrivateType @auth {
    field: String
  }

  type Query {
    publicField: String
    privateField: String @auth
    privateType: PrivateType
  }

  type Mutation {
    _: String
  }
  `;

const resolvers = {
  Query: {
    publicField: () => 'public',
    privateField: () => 'private',
    privateType: () => ({
      field: () => 'private',
    }),
  },
};

const graphqlServer = new ApolloServer({
  typeDefs: [typeDefs, accountsGraphQL.typeDefs],
  resolvers: merge(accountsGraphQL.resolvers, resolvers),
  schemaDirectives: {
    ...accountsGraphQL.schemaDirectives,
  },
  context: ({ req }) => accountsGraphQL.accountsContext(req),
});

graphqlServer.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

## Usage as a GraphQL service

Based on your requirements it can be advantageous to deploy a single accounts server which is then consumed by multiple apps.

The following examples will show you how to setup a GraphQL server which can authenticate requests via a JWT token.

First, start an accounts server:

```javascript
import { AccountsServer } from `@accounts/boost`;

const accountsServer = new AccountsServer({
  tokenSecret: 'your secret',
}).listen();
```

Next update your GraphQL server's context function to authorize the request and add a `user` key to the context. Optionally if you want to use the `@auth` directive, pass in the accounts schema directives.

**Note:** The `tokenSecret` option provided to the accounts service **must match** the one provided to the `accountsContext` function. This is used to sign and validate JWT tokens.

```javascript
import { ApolloServer } from 'apollo-server';
import { AccountsBoost } from '@accounts/boost';

const typeDefs = `
  type PrivateType @auth {
    field: String
  }

  type Query {
    publicField: String
    privateField: String @auth
    privateType: PrivateType
  }

  type Mutation {
    _: String
  }
  `;

const resolvers = {
  Query: {
    publicField: () => 'public',
    privateField: () => 'private',
    privateType: () => ({
      field: () => 'private',
    }),
  },
};

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    ...accountsSchemaDirectives,
  },
  context: ({ req }) => accountsGraphQL.accountsContext({
    tokenSecret: 'bad secret'
  })(req),
});

graphqlServer.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

};
```

## Authentication services

**Packages**

- `@accounts/password`

## Database drivers

**Packages**

- `@accounts/mongo`

## Long install

# About

The accounts-js organization develops and maintains a modular accounts system
for the javascript domain. The basic idea is to have authentication view,
business logic, transport and data storage separated to multiple packages so you
can opt in and out of parts of the account system, but the whole suite should
allow the user to have a complete, generic and customizable account system.

## Prior Art

This project is inspired by Meteor's accounts suite of packages. Meteor
framework had a plug and play approach for its monolithic framework that saved a
ton of work that is traditionally done by any development team, over and over
again. Meteor's accounts system had a couple of restrictions:

- First it was published in Meteor's "atmosphere" package repository and was
  dependent on the Meteor's build tool.
- Second, Meteor is built around DDP and so its accounts system was taking that
  for granted.
- Third, Meteor's dependency on MongoDB meant that the business logic was
  dependant on how the data is stored in the database.

## FAQ

Going into this project we asked ourselves (and were asked by others) a bunch of
questions that helped us define what this project is all about. This is part of
these questions: If you have a question that you think could shape this
project please PR this document or open an issue!

### Why wouldn't you just use passport??

We are not here to replace passport.js. Actually, in our vision, passport.js
will be one authentication method that you can plug in. Currently, the only
problem with passport.js in that regard is that it is designed to work with
connect middlewares and adapter code is needed to plug into let's say a WS
transport. We currently implemented our own local strategy just to make sense
out of basic accounts packages. In the near future it will be separated into its
own package.

### Why not refactor out the Meteor accounts suite?

Well, as explained above, Meteor's accounts system is tied to the data storage
and transport in a way that is actually harder to separate than rewriting with
those abstractions in mind. We do offer an adapter package that allows Meteor
applications an easy and gradual way to move out of Meteor's current accounts
system.

### Why do you use multiple mono-repos?

Early on we understood that a mono-repo is required in order to have a good
developer experience while adding any accounts logic. This also helps us keep the
codebase relatively small for using apps as you will not load in client code on
server apps and vice versa. Although having a mono repo is great, we feel that
someone maintaining the Redis package should not get notifications regarding
changes on the Mongo or React packages. If you are adding in a
feature that requires changes to the transport or the data store packages, we
recommend cloning all of the accounts-js packages into the same directory and just
open your IDE on that directory as project root.
