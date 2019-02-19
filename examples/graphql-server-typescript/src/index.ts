import mongoose from 'mongoose';
import { mergeResolvers, mergeGraphQLSchemas } from 'graphql-toolkit';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import MongoDBInterface from '@accounts/mongo';
import { AccountsModule } from '@accounts/graphql-api';
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
  const accountsGraphQL = AccountsModule.forRoot({
    accountsServer,
  });

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
    typeDefs: mergeGraphQLSchemas([typeDefs, accountsGraphQL.typeDefs]),
    resolvers: mergeResolvers([accountsGraphQL.resolvers as any, resolvers]) as any,
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
    // tslint:disable-next-line:no-console
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();
