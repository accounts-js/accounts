# accounts

Fullstack authentication and accounts-management for GraphQL and REST

[![Backers on Open Collective](https://opencollective.com/accounts-js/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/accounts-js/sponsors/badge.svg)](#sponsors)
[![npm](https://img.shields.io/npm/v/@accounts/server.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/server)
[![CircleCI](https://circleci.com/gh/accounts-js/accounts.svg?style=shield)](https://circleci.com/gh/accounts-js/accounts)
[![codecov](https://codecov.io/gh/accounts-js/accounts/branch/master/graph/badge.svg)](https://codecov.io/gh/accounts-js/accounts)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

_Note: The packages within this repo are under active development — expect breaking changes with minor version updates._

**[Documentation](https://accounts-js.netlify.com/docs/getting-started)**

**[Api Documentation](https://accounts-js.netlify.com/docs/api/server/api-readme)**

**[Examples](https://github.com/accounts-js/accounts/tree/master/examples)**

## About

The `@accounts` suite of packages aims to provide the consumer an end to end authentication and accounts management solution, with a simple to start with interface while preserving options for configuration. These packages provide OAuth support for popular providers such as Instagram, Twitter, Github, two factor authentication, password based accounts along with recovery options and customizable account creation and validation.

The `@accounts` packages are modular by nature and can be manually installed and configured, however we provide `@accounts/boost` - a package containing useful abstractions to get a GraphQL accounts server started with minimal configuration.

## Getting started with @accounts/boost

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
  }).listen({
    port: 4003
  });

})();
```

At this point you will have an accounts GraphQL server running at http://localhost:4003 with a GraphQL playground available at the same address.

Configuring additional options, such as providing custom connection options for a database or additional parameters based on your chosen packages can be achieved by supplying an options object when initializing the `accountsBoost`.

Assuming you've installed the following packages, `@accounts/mongo` and `@accounts/password` the default mongo connection options will be applied and a database called `accounts-js` will be used.

Out of the box `@accounts/password` is preconfigured to allow users to sign up with usernames or email addresses.

<!-- Add a link to the options type definitions  -->

## Usage with an existing GraphQL server

A GraphQL server can be extended with accounts functionality by using the `accountsBoost.graphql()` function.

This function will return the type definitions, resolvers, schema directives, the accounts GraphQL context function used for authentication, and finally the executable GraphQL schema.

These variables should then be referenced when creating your GraphQL server.

**Adding accounts to a GraphQL server**

```javascript
import accountsBoost, { authenticated } from '@accounts/boost';
import { ApolloServer } from 'apollo-server';
import { mergeGraphQLSchemas, mergeResolvers } from '@graphql-modules/epoxy';

(async () => {
  const accounts = (await accountsBoost({
    tokenSecret: 'terrible secret',
  })).graphql();

  const typeDefs = `
    type PrivateType @auth {
      privateField: String
    }

    type Query {
      publicField: String
      privateField: String @auth
      privateType: PrivateType
      privateFieldWithAuthResolver: String
    }

    type Mutation {
      privateMutation: String @auth
      publicMutation: String
    }
    `;

  const resolvers = {
    PrivateType: {
      privateField: () => 'private',
    },
    Query: {
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => '',
      privateFieldWithAuthResolver: authenticated((root, args, context) => {
        return 'private';
      }),
    },
    Mutation: {
      privateMutation: () => 'private',
      publicMutation: () => 'public',
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs: mergeGraphQLModules([typeDefs, accounts.typeDefs]),
    resolvers: mergeResolvers([accounts.resolvers, resolvers]),
    schemaDirectives: {
      // In order for the `@auth` directive to work
      ...accounts.schemaDirectives,
    },
    context: ({ req }) => accounts.context({ req }),
  } as any)
    .listen()
    .then(res => {
      console.log(`GraphQL server running at ${res.url}`);
    });
})();
```

## Usage as a GraphQL micro service

Based on your requirements it can be advantageous to deploy a single accounts server which is then consumed by multiple apps.

The following examples will show you how to setup a GraphQL server which can be used to authenticate requests via JWT token.

First start an accounts server:

```javascript
import accountsBoost from '@accounts/boost';

(async () => {
  const accounts = await accountsBoost({
    tokenSecret: 'terrible secret',
  });

  const accountsServer = await accounts.listen();
})();
```

Next you need to configure your existing GraphQL server to authenticate incoming requests by using the context function provided by `accountsBoost`. Additionally you may merge your existing GraphQL server schema with the accounts server schema.

```javascript
import accountsBoost, { authenticated } from '@accounts/boost';
import {
  makeExecutableSchema,
  mergeSchemas,
  makeRemoteExecutableSchema,
  introspectSchema,
} from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import { ApolloServer } from 'apollo-server';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

const accountsServerUri = 'http://localhost:4003/';

(async () => {
  const accounts = (await accountsBoost({
    tokenSecret: 'terrible secret',
    micro: true, // setting micro to true will instruct `@accounts/boost` to only verify access tokens without any additional session logic
  })).graphql();

  // Note: the following steps are optional and only required if you want to stitch the remote accounts schema with your apps schema.

  // Creates a link to fetch the remote schema from the accounts microservice.

  const http = new HttpLink({ uri: accountsServerUri, fetch });

  const link = setContext((request, previousContext) => {
    if (!previousContext.graphqlContext) {
      return {};
    }
    // Attach the Authorization to requests which are proxied to the remote schema.
    // This step is optional and only required if you want the `getUser` query to return data.
    return {
      headers: {
        Authorization: 'Bearer ' + previousContext.graphqlContext.authToken,
      },
    };
  }).concat(http);

  const remoteSchema = await introspectSchema(link);

  const executableRemoteSchema = makeRemoteExecutableSchema({
    schema: remoteSchema,
    link,
  });

  // The @auth directive needs to be declared in your typeDefs

  const typeDefs = `
    directive @auth on FIELD_DEFINITION | OBJECT

    type PrivateType @auth {
      privateField: String
    }

    type Query {
      publicField: String
      privateField: String @auth
      privateType: PrivateType
      privateFieldWithAuthResolver: String
    }
    `;

  const resolvers = {
    PrivateType: {
      privateField: () => 'private',
    },
    Query: {
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => '',
      privateFieldWithAuthResolver: authenticated((root, args, context) => {
        return 'private';
      }),
    },
  };

  const executableLocalSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const apolloServer = await new ApolloServer({
    schema: mergeSchemas({
      schemas: [executableLocalSchema, executableRemoteSchema],
      schemaDirectives: {
        // In order for the `@auth` directive to work
        ...accounts.schemaDirectives,
      },
    }),
    context: ({ req }) => accounts.context({ req }),
  }).listen();

  console.log(`GraphQL server running at ${apolloServer.url}`);
})();
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

- Slack - accounts-js.slack.com
- [Meeting notes](https://github.com/accounts-js/accounts/blob/master/MEETINGS.md)

## Thank you

This project exists thanks to all the people who contribute:
<a href="https://github.com/accounts-js/accounts/graphs/contributors"><img src="https://opencollective.com/accounts-js/contributors.svg?width=890" /></a>

### Backers

Thank you to all our backers! 🙏

<a href="https://opencollective.com/accounts-js#backers" target="_blank"><img src="https://opencollective.com/accounts-js/backers.svg?width=890"></a>

### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website.

[Become a sponsor](https://opencollective.com/accounts-js#sponsor)

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

### Prior Art

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

### FAQ

Going into this project we asked ourselves (and were asked by others) a bunch of
questions that helped us define what this project is all about. This is part of
these questions: If you have a question that you think could shape this
project please PR this document or open an issue!

### Why wouldn't you just use passport?

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

### Why do you use a mono-repo?

Early on we understood that a mono-repo is required in order to have a good
developer experience while adding any accounts logic. This also helps us keep the
codebase relatively small for using apps as you will not load in client code on
server apps and vice versa. Although having a mono repo is great, we feel that
someone maintaining the Redis package should not get notifications regarding
changes on the Mongo or React packages. If you are adding in a
feature that requires changes to the transport or the data store packages, we
recommend cloning all of the accounts-js packages into the same directory and just
open your IDE on that directory as project root.
