import accountsBoost, { authenticated } from '@accounts/boost';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer, gql } from 'apollo-server';
import { authDirective, context } from '@accounts/graphql-api';
import { AccountsPasswordOptions } from '@accounts/password/lib/accounts-password';

(async () => {
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
          return accounts.accountsServer.findUserById(ctx.userId);
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

  const accounts = await accountsBoost({
    tokenSecret: 'terrible secret',
    services: {
      password: {
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
      } as AccountsPasswordOptions,
    },
    schemaBuilder: ({ typeDefs: accountsTypeDefs, resolvers: accountsResolvers }) =>
      authDirectiveTransformer(
        makeExecutableSchema({
          typeDefs: mergeTypeDefs([typeDefs, authDirectiveTypeDefs, ...accountsTypeDefs]),
          resolvers: mergeResolvers([resolvers, ...accountsResolvers]),
        })
      ),
  });

  // You can let boost start its own Apollo Server
  // accounts.listen({port: 4000});

  // Or you can use your own
  new ApolloServer({
    schema: accounts.application.createSchemaForApollo(),
    context: ({ req }) => {
      return context({ req }, { accountsServer: accounts.accountsServer });
    },
  })
    .listen()
    .then((res) => {
      console.log(`GraphQL server running at ${res.url}`);
    });
})();
