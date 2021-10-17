import { DatabaseManager } from '@accounts/database-manager';
import {
  authDirective,
  authenticated,
  context,
  createAccountsCoreModule,
  createAccountsPasswordModule,
} from '@accounts/graphql-api';
import MongoDBInterface from '@accounts/mongo';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer, ServerHooks } from '@accounts/server';
import { ApolloServer } from 'apollo-server';
import gql from 'graphql-tag';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import mongoose from 'mongoose';
import { createApplication } from 'graphql-modules';
import { makeExecutableSchema } from '@graphql-tools/schema';

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
    validateNewUser: (user) => {
      if (!user.firstName) {
        throw new Error('First name required');
      }
      if (!user.lastName) {
        throw new Error('Last name required');
      }

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accountsServer.on(ServerHooks.ValidateLogin, ({ user }) => {
    // This hook is called every time a user try to login.
    // You can use it to only allow users with verified email to login.
    // If you throw an error here it will be returned to the client.
  });

  const typeDefs = gql`
    type PrivateType @auth {
      field: String
    }

    # Our custom fields to add to the user
    extend input CreateUserInput {
      firstName: String!
      lastName: String!
    }

    extend type User {
      firstName: String!
      lastName: String!
    }

    extend type Query {
      # Example of how to get the userId from the context and return the current logged in user or null
      me: User
      publicField: String
      # You can only query this if you are logged in
      privateField: String @auth
      privateType: PrivateType
      privateFieldWithAuthResolver: String
    }

    extend type Mutation {
      privateMutation: String @auth
      publicMutation: String
    }
  `;

  const resolvers = {
    Query: {
      me: (_, __, ctx) => {
        // ctx.userId will be set if user is logged in
        if (ctx.userId) {
          return accountsServer.findUserById(ctx.userId);
        }
        return null;
      },
      publicField: () => 'public',
      privateField: () => 'private',
      privateFieldWithAuthResolver: authenticated(() => {
        return 'private';
      }),
      privateType: () => ({
        field: () => 'private',
      }),
    },
    Mutation: {
      privateMutation: () => 'private',
      publicMutation: () => 'public',
    },
  };

  const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective('auth');

  const schema = createApplication({
    modules: [
      createAccountsCoreModule({ accountsServer }),
      createAccountsPasswordModule({ accountsPassword }),
    ],
    schemaBuilder: ({ typeDefs: accountsTypeDefs, resolvers: accountsResolvers }) =>
      authDirectiveTransformer(
        makeExecutableSchema({
          typeDefs: mergeTypeDefs([typeDefs, authDirectiveTypeDefs, ...accountsTypeDefs]),
          resolvers: mergeResolvers([resolvers, ...accountsResolvers]),
        })
      ),
  }).createSchemaForApollo();

  // Create the Apollo Server that takes a schema and configures internal stuff
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return context({ req }, { accountsServer });
    },
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();
