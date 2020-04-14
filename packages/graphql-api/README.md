# @accounts/graphql-api

_Schema, Resolvers and Utils for GraphQL server with JSAccounts_

[![npm](https://img.shields.io/npm/v/@accounts/graphql-api.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/graphql-api)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

> This package does not requires any network interface / express in order to combine with your GraphQL - it's just a collection of GraphQL schema, resolvers and utils!

## How to use this package?

This package exports GraphQL schema and GraphQL resolvers, which you can extend with your existing GraphQL schema server.

Start by installing it from NPM / Yarn:

```bash
// Npm
npm install --save @accounts/server @accounts/graphql-api @graphql-modules/core

// Yarn
yarn add @accounts/server @accounts/graphql-api @graphql-modules/core
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

Next, import `AccountsModule` from this package, and run it with your `AccountsServer`:

```js
import { AccountsModule } from '@accounts/graphql-api';

const accountsGraphQL = AccountsModule.forRoot({
  accountsServer,
});
```

Now, add `accountsGraphQL.typeDefs` to your schema definition (just before using it with `makeExecutableSchema`), and merge your resolvers object with `accountsGraphQL.resolvers` by using `@graphql-tools/epoxy`, for example:

```js
import { makeExecutableSchema } from 'graphql-tools';
import { mergeGraphQLSchemas, mergeResolvers } from '@graphql-tools/epoxy';

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
  resolvers: mergeResolvers([accountsGraphQL.resolvers, myResolvers]),
  typeDefs: mergeGraphQLSchemas([typeDefs]),
});
```

The last step is to extend your `graphqlExpress` with a context middleware, that extracts the authentication token from the HTTP request, so AccountsServer will automatically validate it:

```js
app.use(
  GRAPHQL_ROUTE,
  bodyParser.json(),
  graphqlExpress((request) => {
    return {
      context: {
        ...accountsGraphQL(request),
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

Another possible customization is to modify the name of the authentication header, use it with `accountsContext` (the default is `Authorization`):

```js
const myCustomGraphQLAccounts = AccountsModule.forRoot({
  accountsServer,
  rootQueryName: 'RootQuery',
  rootMutationName: 'RootMutation',
  headerName: 'MyCustomHeader',
});
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
