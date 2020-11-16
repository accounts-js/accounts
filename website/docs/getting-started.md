---
id: getting-started
title: Getting started with @accounts/boost
sidebar_label: '@accounts/boost'
---

The `@accounts` packages are modular by nature and can be manually installed and configured, however we provide `@accounts/boost` - a package containing useful abstractions to get a GraphQL accounts server started with minimal configuration.

**Install the core**

```bash
// Npm
npm install --save @accounts/boost

// Yarn
yarn add @accounts/boost
```

**Choose your database database driver**

```bash
// Npm
npm install --save @accounts/mongo

// Yarn
yarn add @accounts/mongo
```

**Choose your authentication services**

```bash
// Npm
npm install --save @accounts/password

// Yarn
yarn add @accounts/password
```

The following starts an accounts server using the database, transport, and authentication services you provided with the default settings.

**Start the accounts server**

```javascript
import accountsBoost from `@accounts/boost`;

(async () => {

  const accounts = await accountsBoost({
    tokenSecret: 'your secret'
  });
  const accountsServer = await accounts.listen({
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
import { merge } from 'lodash';

(async () => {
  const accounts = (await accountsBoost({
    tokenSecret: 'terrible secret',
  })).graphql();

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
    typeDefs: [typeDefs, accounts.typeDefs],
    resolvers: merge(accounts.resolvers, resolvers),
    schemaDirectives: {
      // In order for the `@auth` directive to work
      ...accounts.schemaDirectives,
    },
    context: ({ req }) => accounts.context(req),
  } as any)
    .listen()
    .then(res => {
      console.log(`GraphQL server running at ${res.url}`);
    });
})();
```

## Usage as a GraphQL microservice

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
import { mergeSchemas } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { introspectSchema, makeRemoteExecutableSchema } from '@graphql-tools/wrap';
import { HttpLink } from 'apollo-link-http';
import { ApolloServer } from 'apollo-server';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

const accountsServerUri = 'http://localhost:4003/';

(async () => {
  const accounts = (
    await accountsBoost({
      tokenSecret: 'terrible secret',
      micro: true, // setting micro to true will instruct `@accounts/boost` to only verify access tokens without any additional session logic
    })
  ).graphql();

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
    context: ({ req }) => accounts.context(req),
  }).listen();

  console.log(`GraphQL server running at ${apolloServer.url}`);
})();
```
