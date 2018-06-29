# @accounts/graphql-api

*Server side GraphQL for accounts*

[![npm](https://img.shields.io/npm/v/@accounts/graphql-api.svg?maxAge=2592000)](https://www.npmjs.com/package/@accounts/graphql-api) [![Circle CI](https://circleci.com/gh/js-accounts/graphql-api.svg?style=shield)](https://circleci.com/gh/js-accounts/graphql-api) [![Coverage Status](https://coveralls.io/repos/github/js-accounts/graphql-api/badge.svg?branch=master)](https://coveralls.io/github/js-accounts/graphql-api?branch=master) ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

## Note
This package is under active development and is just starting to form a structure.
Currently the package holds it's own express server.
After some work is done, it will require an express app to be supplied.
Ideally, it would not matter weather it is express or other network transport altogether.

## Start dev server

```bash
yarn
yarn start
```

## How to use this package?

This package exports GraphQL schema and GraphQL resolvers, which you can extend with your existing GraphQL schema server.

> This package does not create a transport or anything else, only schema and string and resolvers as object.

Start by configuring your `AccountsServer` as you wish. for example:

```js
AccountsServer.config({
// ... you config here
}, new Mongo(await getDb()));
```

Next, import `createJSAccountsGraphQL` method from this package, and run it with your `AccountsServer`:

```js
import { createJSAccountsGraphQL } from '@accounts/graphql-api';

const accountsGraphQL = createJSAccountsGraphQL(Accounts);
```

Now, add `accountsGraphQL.schema` to your schema definition (just before using it with `makeExecutableSchema`), and use `accountsGraphQL.extendWithResolvers` to extend your resolvers object, for example:

```js
import { makeExecutableSchema } from 'graphql-tools';

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
  accountsGraphQL.schema
];

let myResolvers = {
  Query: {
    myQuery: () => 'Hello'
  },
  Mutation: {
    myMutation: () => 'Hello'
  }
};

const resolversWithAccounts = accountsGraphQL.extendWithResolvers(myResolvers);

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});
```

The last step is to extend your `graphqlExpress` with a context middleware, that extracts the authentication token from the HTTP request, so AccountsServer will automatically validate it:

```js
import { JSAccountsContext } from '@accounts/graphql-api';

app.use(GRAPHQL_ROUTE, bodyParser.json(), graphqlExpress(request => {
  return {
    context: JSAccountsContext(request),
    schema,
  };
}));
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

* `rootQueryName` (string) - The name of the root query, default: `Query`.
* `rootMutationName` (string) - The name of the root mutation, default: `Mutation`.
* `extend` (boolean) - whether to add `extend` before the root type declaration, default: `true`.
* `withSchemaDefinition` (boolean): whether to add `schema { ... } ` declaration to the generation schema, default: `false`.
  
Pass a second object to `createJSAccountsGraphQL`, for example:

```js
const myCustomGraphQLAccounts = createSchemaWithAccounts(AccountsServer, {
  rootQueryName: 'RootQuery',
  rootMutationName: 'RootMutation',
});
```

Another possible customization is to modify the name of the authentication header, use it with `JSAccountsContext` (the default is `Authorization`):

```js
context: JSAccountsContext(request, 'MyCustomHeader')
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
