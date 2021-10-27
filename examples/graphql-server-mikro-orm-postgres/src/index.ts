import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';
import {
  authDirective,
  context,
  createAccountsCoreModule,
  createAccountsPasswordModule,
} from '@accounts/graphql-api';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer, ServerHooks } from '@accounts/server';
import { AccountsMikroOrm } from '@accounts/mikro-orm';
import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm-config';
import { User } from './entities/user';
import { Email } from './entities/email';
import { createApplication } from 'graphql-modules';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';

export const createAccounts = async () => {
  const orm = await MikroORM.init(config);
  const { em } = orm;

  const accountsDb = new AccountsMikroOrm({ em, UserEntity: User, EmailEntity: Email });

  const accountsPassword = new AccountsPassword({
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
  });

  // Create accounts server that holds a lower level of all accounts operations
  const accountsServer = new AccountsServer(
    { db: accountsDb, tokenSecret: config.password },
    { password: accountsPassword }
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

  const resolvers = {
    Query: {
      me: async (_, __, ctx) => {
        // ctx.userId will be set if user is logged in
        if (ctx.userId) {
          return accountsServer.findUserById(ctx.userId);
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
