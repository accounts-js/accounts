import { DatabaseManager } from '@accounts/database-manager';
import { AccountsModule } from '@accounts/graphql-api';
import MongoDBInterface from '@accounts/mongo';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer } from '@accounts/server';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import gql from 'graphql-tag';
import { mergeResolvers, mergeTypeDefs } from 'graphql-toolkit';
import mongoose from 'mongoose';

const start = async () => {
  // Create database connection
  await mongoose.connect('mongodb://localhost:27017/accounts-js-graphql-example', {
    useNewUrlParser: true,
  });
  const mongoConn = mongoose.connection;

  // Build a storage for storing users
  const userStorage = new MongoDBInterface(mongoConn);
  // Create database manager (create user, find users, sessions etc) for accounts-js
  const accountsDb = new DatabaseManager({
    sessionStorage: userStorage,
    userStorage,
  });

  const accountsPassword = new AccountsPassword({
    // This option is called when a new user create an account
    // Inside we can apply our logic to validate the user fields
    validateNewUser: user => {
      // For example we can allow only some kind of emails
      if (user.email.endsWith('.xyz')) {
        throw new Error('Invalid email');
      }
      return user;
    },
  });

  // Create accounts server that holds a lower level of all accounts operations
  const accountsServer = new AccountsServer(
    { db: accountsDb, tokenSecret: 'secret' },
    {
      password: accountsPassword,
    }
  );

  // Creates resolvers, type definitions, and schema directives used by accounts-js
  const accountsGraphQL = AccountsModule.forRoot({
    accountsServer,
  });

  const typeDefs = gql`
    type PrivateType @auth {
      field: String
    }

    # Our custom fields to add to the user
    extend input CreateUserInput {
      profile: CreateUserProfileInput!
    }

    input CreateUserProfileInput {
      firstName: String!
      lastName: String!
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
    typeDefs: mergeTypeDefs([typeDefs, accountsGraphQL.typeDefs]),
    resolvers: mergeResolvers([accountsGraphQL.resolvers, resolvers]),
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

start();
