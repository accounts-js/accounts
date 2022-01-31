import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';
import {
  buildSchema,
  createAccountsCoreModule,
  createAccountsPasswordModule,
} from '@accounts/graphql-api';
import { AccountsPassword } from '@accounts/password';
import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm-config';
import { User } from './entities/user';
import { Email } from './entities/email';
import { createApplication } from 'graphql-modules';
import AccountsServer, { AuthenticationServicesToken, ServerHooks } from '@accounts/server';
import { context, createAccountsMikroORMModule } from '@accounts/module-mikro-orm';

export const createAccounts = async () => {
  const orm = await MikroORM.init(config);

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

    type Query {
      # Example of how to get the userId from the context and return the current logged in user or null
      me: User
      publicField: String
      # You can only query this if you are logged in
      privateField: String @auth
      privateType: PrivateType
    }

    type Mutation {
      _: String
    }
  `;

  // TODO: use resolvers typings from codegen
  const resolvers = {
    Query: {
      me: async (_, __, ctx) => {
        // ctx.userId will be set if user is logged in
        if (ctx.userId) {
          // We could have simply returned ctx.user instead
          return ctx.accountsServer.findUserById(ctx.userId);
        }
        return null;
      },
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => ({
        field: () => 'private',
      }),
    },
  };

  const app = createApplication({
    modules: [
      createAccountsCoreModule({ tokenSecret: config.password }),
      createAccountsPasswordModule({
        // This option is called when a new user create an account
        // Inside we can apply our logic to validate the user fields
        // By default accounts-js only allow 'username', 'email' and 'password' for the user
        // In order to add custom fields you need to pass the validateNewUser function when you
        // instantiate the 'accounts-password' package
        validateNewUser: (user) => {
          // For example we can allow only some kind of emails
          if (user.email.endsWith('.xyz')) {
            throw new Error('Invalid email');
          }
          return user;
        },
      }),
      createAccountsMikroORMModule({
        UserEntity: User,
        EmailEntity: Email,
        // Provide EntityManager either via context or via Providers
        em: orm.em,
      }),
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
      ...(await context(
        { req },
        {
          app,
          // Provide EntityManager either via context or via Providers
          //em: orm.em.fork()
        }
      )),
      // If you don't use GraphQL Modules in your app you will have to share the
      // accountsServer instance via context in order to access it via resolvers
      accountsServer: injector.get(AccountsServer),
    }),
  });

  server.listen(4000).then(async ({ url }) => {
    console.log(`🚀  Server ready at ${url}`);

    try {
      const generator = orm.getSchemaGenerator();
      await generator.createSchema({ wrap: true });
    } catch {
      // Schema has already been created
    }
  });
};
createAccounts();
