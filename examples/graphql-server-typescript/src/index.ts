import 'reflect-metadata';
import {
  authenticated,
  buildSchema,
  context,
  createAccountsCoreModule,
  createAccountsPasswordModule,
} from '@accounts/graphql-api';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer, AuthenticationServicesToken, ServerHooks } from '@accounts/server';
import { ApolloServer } from 'apollo-server';
import gql from 'graphql-tag';
import mongoose from 'mongoose';
import { createApplication } from 'graphql-modules';
import { createAccountsMongoModule } from '@accounts/module-mongo';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';

const start = async () => {
  // Create database connection
  await mongoose.connect('mongodb://localhost:27017/accounts-js-graphql-example');
  const dbConn = mongoose.connection;

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

  // TODO: use resolvers typings from codegen
  const resolvers = {
    Query: {
      me: (_, __, ctx) => {
        // ctx.userId will be set if user is logged in
        if (ctx.userId) {
          // We could have simply returned ctx.user instead
          return ctx.accountsServer.findUserById(ctx.userId);
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

  const app = createApplication({
    modules: [
      createAccountsCoreModule({ tokenSecret: 'secret' }),
      createAccountsPasswordModule({
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
      }),
      createAccountsMongoModule({ dbConn }),
    ],
    providers: [
      {
        provide: AuthenticationServicesToken,
        useValue: { password: AccountsPassword },
        global: true,
      },
    ],
    schemaBuilder: buildSchema({ typeDefs, resolvers }),
  });
  const { injector } = app;
  const schema = app.createSchemaForApollo();

  injector.get(AccountsServer).on(ServerHooks.ValidateLogin, ({ user }) => {
    // This hook is called every time a user try to login.
    // You can use it to only allow users with verified email to login.
    // If you throw an error here it will be returned to the client.
    console.log(`${user.firstName} ${user.lastName} logged in`);
  });

  // Create the Apollo Server that takes a schema and configures internal stuff
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => ({
      ...(await context({ req }, { injector })),
      // If you don't use GraphQL Modules in your app you will have to share the
      // accountsServer instance via context in order to access it via resolvers
      accountsServer: injector.get(AccountsServer),
    }),
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();
