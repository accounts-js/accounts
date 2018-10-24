---
id: graphql
title: GraphQL
sidebar_label: GraphQL
---

_Schema, Resolvers and Utils for GraphQL server with JSAccounts_

[Github](https://github.com/accounts-js/accounts/tree/master/packages/graphql-api) |
[npm](https://www.npmjs.com/package/@accounts/graphql-api)

> The GraphQL Api package does not contain any network interface / rest server (e.g. express or koa). it's just a collection of GraphQL schema, resolvers and utils!

## How to use this package?

This package exports GraphQL schema and GraphQL resolvers, which you can extend with your existing GraphQL schema server.

Start by installing it from NPM / Yarn:

```bash
// Npm
npm install --save @accounts/server @accounts/graphql-api

// Yarn
yarn add @accounts/server @accounts/graphql-api
```

> This package does not create a transport or anything else, only schema and string and resolvers as object.

Start by configuring your `AccountsServer` as you wish. For example, using MongoDB:

```js
import mongoose from 'mongoose'
import AccountsServer from '@accounts/server'
import AccountsPassword from '@accounts/password'
import MongoDBInterface from '@accounts/mongo'

const db = mongoose.connection

const password = new AccountsPassword()

const accountsServer = new AccountsServer({
  {
    db: new MongoDBInterface(db),
    tokenSecret: 'SECRET',
  },
  {
    password,
  }
});
```

Next, import `createAccountsGraphQL` method from this package, and run it with your `AccountsServer`:

```js
import { createAccountsGraphQL } from '@accounts/graphql-api';

const accountsGraphQL = createAccountsGraphQL(accountsServer);
```

Now, add `accountsGraphQL.typeDefs` to your schema definition (just before using it with `makeExecutableSchema`), and extend your resolvers object with `accountsGraphQL.resolvers`, for example:

```js
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';

const typeDefs = [
  `
  type Query {
    myQuery: String
  }

  type Mutation {
    myMutation: String
  }

  schema {
      query: Query,
      mutation: Mutation
  }
  `,
  accountsGraphQL.typeDefs,
];

let myResolvers = {
  Query: {
    myQuery: () => 'Hello',
  },
  Mutation: {
    myMutation: () => 'Hello',
  },
};

const schema = makeExecutableSchema({
  resolvers: merge(accountsGraphQL.resolvers, myResolvers),
  typeDefs,
});
```

The last step is to extend your `graphqlExpress` with a context middleware, that extracts the authentication token from the HTTP request, so AccountsServer will automatically validate it:

```js
import { accountsContext } from '@accounts/graphql-api';

app.use(
  GRAPHQL_ROUTE,
  bodyParser.json(),
  graphqlExpress(request => {
    return {
      context: {
        ...accountsContext(request),
        // your context
      },
      schema,
    };
  })
);
```

## Authenticating Resolvers

You can authenticate your own resolvers with `JSAccounts` authentication flow, by using `authenticated` method from this package.

This method composer also extends `context` with the current authenticated user!

This is an example for a protected mutation:

```js
import AccountsServer from '@accounts/server';
import { authenticated } from '@accounts/graphql-api';

export const resolver = {
  Mutation: {
    updateUserProfile: authenticated(AccountsServer, (rootValue, args, context) => {
      // Write your resolver here
      // context.user - the current authenticated user!
    }),
  },
};
```

## Customization

This package allow you to customize the GraphQL schema and it's resolvers.

For example, some application main query called `MyQuery` or `RootQuery` instead of query, so you can customize the name, without modifying you application's schema.

These are the available customizations:

- `rootQueryName` (string) - The name of the root query, default: `Query`.
- `rootMutationName` (string) - The name of the root mutation, default: `Mutation`.
- `extend` (boolean) - whether to add `extend` before the root type declaration, default: `true`.
- `withSchemaDefinition` (boolean): whether to add `schema { ... }` declaration to the generation schema, default: `false`.

Pass a second object to `createAccountsGraphQL`, for example:

```js
const myCustomGraphQLAccounts = createSchemaWithAccounts(accountsServer, {
  rootQueryName: 'RootQuery',
  rootMutationName: 'RootMutation',
});
```

Another possible customization is to modify the name of the authentication header, use it with `accountsContext` (the default is `Authorization`):

```js
context: accountsContext(request, 'MyCustomHeader');
```

## Extending `User`

To extend `User` object with custom fields and logic, add your own GraphQL type definition of `User` with the prefix of `extend`, and add your fields:

```graphql
extend type User {
  firstName: String
  lastName: String
}
```

And also implement a regular resolver, for the fields you added:

```js
const UserResolver = {
  firstName: () => 'Dotan',
  lastName: () => 'Simha',
};
```

## Extending `User` during password creation

To extend the user object during the user creation you need to extend the `CreateUserInput` type and add your fields:

```graphql
extend input CreateUserInput {
  profile: CreateUserProfileInput!
}

input CreateUserProfileInput {
  firstName: String!
  lastName: String!
}
```

The user will be saved in the db with the profile key set.

# GraphQL Client

_Client side graphql transport for accounts suite_

[Github](https://github.com/accounts-js/accounts/tree/master/packages/graphql-client) |
[npm](https://www.npmjs.com/package/@accounts/graphql-client)

## Install

```
yarn add @accounts/graphql-client
```

## Usage

```js
import { ApolloClient } from 'apollo-client';
import { AccountsGraphQLClient } from '@accounts/graphql-client';

const apolloClient = new ApolloClient({
  // apollo options
});

const accountsGraphQL = new GraphQLClient({
  graphQLClient: apolloClient,
  // other options
});
```

## Using with Apollo Link

In order to send the accounts token on every request sent to your GraphQL server, apollo requires you to implment an apollo-link. This link is usually quite generic when using accounts-js so we've implmeneted the apollo-link you need and offer it as a utility package.

### Install @accounts/apollo-link

```
yarn add @accounts/apollo-link
```

### Hook it up to the apollo client

```js
import { accountsLink } from '@accounts/apollo-link';

const accountsClient = new AccountsClient( ... );
const authLink = accountsLink(accountsClient);

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache,
});
```
