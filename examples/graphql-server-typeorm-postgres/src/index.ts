import 'dotenv/config';
import 'reflect-metadata';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer, AuthenticationServicesToken } from '@accounts/server';
import { connect } from './connect';
import { createApplication, gql } from 'graphql-modules';
import { buildSchema, context, createAccountsCoreModule } from '@accounts/module-core';
import { createAccountsPasswordModule } from '@accounts/module-password';
import { createAccountsTypeORMModule } from '@accounts/module-typeorm';
import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { useGraphQLModules } from '@envelop/graphql-modules';

export const createAccounts = async () => {
  const connection = await connect(process.env.DATABASE_URL);
  const tokenSecret = process.env.ACCOUNTS_SECRET;

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
      # Make fistName and lastName non-mandatory until the typeorm adapter supports separately extending the entities
      # Otherwise we will have to create a custom UserEntity along with UserEmail, UserService and UserSession because they depend on each other
      # EntitySchema is the way (see the Mikro ORM adapter)
      firstName: String
      lastName: String
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
          return ctx.injector.get(AccountsServer).findUserById(ctx.userId);
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
      createAccountsCoreModule({ tokenSecret }),
      createAccountsPasswordModule(),
      createAccountsTypeORMModule({
        connection,
        cache: 1000,
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

  const { createOperationController } = app;

  // Create a Yoga instance with a GraphQL schema.
  const yoga = createYoga({
    plugins: [useGraphQLModules(app)],
    context: (ctx) => context(ctx, { createOperationController }),
  });

  // Pass it into a server to hook into request handlers.
  const server = createServer(yoga);

  // Start the server and you're done!
  server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql');
  });
};
createAccounts();
