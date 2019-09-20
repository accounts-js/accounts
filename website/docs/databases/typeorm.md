---
id: typeorm
title: TypeORM
sidebar_label: TypeORM
---

TypeORM data store for accounts-js

[Github](https://github.com/accounts-js/accounts/tree/master/packages/database-mongo) |
[npm](https://www.npmjs.com/package/@accounts/typeorm)

> It is our long-term goal for typeorm package to be database agnostic and support all database types it does by default.
> For now it only works and has been tested with PostgreSQL, feel free to explore other typeorm-integrations.

## Install

```javascript
yarn add @accounts/typeorm typeorm pg
```

## Usage

```typescript
import AccountsServer from '@accounts/server';
import typeorm from '@accounts/typeorm';
import { createConnection } from 'typeorm';

export const createAccounts = async () => {
  const connection = await connect(process.env.DATABASE_URL);
  // Like, fix this man!
  const tokenSecret = 'BAD SECRET';
  const db = new AccountsTypeorm({ connection, cache: 1000 });
  const password = new AccountsPassword();
  const accountsServer = new AccountsServer(
    {
      db,
      tokenSecret,
      siteUrl: 'http://localhost:3000',
    },
    { password }
  );
  // Creates resolvers, type definitions, and schema directives used by accounts-js
  const accountsGraphQL = AccountsModule.forRoot({
    accountsServer,
  });
  };
  const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs[accountsGraphQL.typeDefs],
    resolvers: [accountsGraphQL.resolvers],
    schemaDirectives: {
      ...accountsGraphQL.schemaDirectives,
    },
  });

  // Create the Apollo Server that takes a schema and configures internal stuff
  const server = new ApolloServer({
    schema,
    context: accountsGraphQL.context,
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};
createAccounts();
// Edit this line with your postgres url
export const connect = (url = 'postgres://localhost:5432') => {
  return createConnection({
    type: 'postgres',
    url,
    entities: [...require('@accounts/typeorm').entities],
    synchronize: true,
  }).then(connection => {
    return connection;
  });
```

## Example

You can find an example using the database-typeeorm package with a PostgreSQL database in the examples folder
[graphql-server-typeorm-postgres](https://github.com/accounts-js/accounts/tree/master/examples/graphql-server-typeorm-postgres)
