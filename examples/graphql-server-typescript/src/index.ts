import * as mongoose from 'mongoose';
import { merge } from 'lodash';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import MongoDBInterface from '@accounts/mongo';
import { createAccountsGraphQL, accountsContext } from '@accounts/graphql-api';
import { DatabaseManager } from '@accounts/database-manager';

const start = async () => {
  // Create database connection
  await mongoose.connect('mongodb://localhost:27017/accounts-js-graphql-example');
  const mongoConn = mongoose.connection;

  // Build a storage for storing users
  const userStorage = new MongoDBInterface(mongoConn);
  // Create database manager (create user, find users, sessions etc) for accounts-js
  const accountsDb = new DatabaseManager({
    sessionStorage: userStorage,
    userStorage,
  });

  // Create accounts server that holds a lower level of all accounts operations
  const accountsServer = new AccountsServer(
    { db: accountsDb, tokenSecret: 'secret' },
    {
      password: new AccountsPassword(),
    }
  );

  // Creates resolvers, type definitions, and schema directives used by accounts-js
  const accountsGraphQL = createAccountsGraphQL(
    accountsServer,
    { extend: true } // Extends root query and mutations instead of creating new ones
  );

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

  const schema = makeExecutableSchema({
    typeDefs: [typeDefs, accountsGraphQL.typeDefs],
    resolvers: merge(accountsGraphQL.resolvers, resolvers),
    schemaDirectives: {
      ...accountsGraphQL.schemaDirectives,
    },
  });

  // Create the Apollo Server that takes a schema and configures internal stuff
  const server = new ApolloServer({
    schema,
    context: ({ req }) => accountsContext(req),
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();
