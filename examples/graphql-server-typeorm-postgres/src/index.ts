import 'dotenv/config';
import 'reflect-metadata';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer, AuthenticationServicesToken } from '@accounts/server';
import { connect } from './connect';
import { createApplication, gql } from 'graphql-modules';
import { buildSchema, context, createAccountsCoreModule } from '@accounts/module-core';
import { createAccountsPasswordModule } from '@accounts/module-password';
import { createAccountsTypeORMModule } from '@accounts/module-typeorm';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';

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

  const { createOperationController, createSchemaForApollo } = createApplication({
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
  const schema = createSchemaForApollo();

  // Create the Apollo Server that takes a schema and configures internal stuff
  const server = new ApolloServer({
    schema,
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: (ctx) => context(ctx, { createOperationController }),
  });

  console.log(`🚀  Server ready at ${url}`);
};
createAccounts();
