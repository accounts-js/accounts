import accountsBoost from '@accounts/boost';
import { authDirective } from '@accounts/graphql-api';
import { AccountsPasswordOptions } from '@accounts/password/lib/accounts-password';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'apollo-server';

(async () => {
  const typeDefs = gql`
    # Our custom fields to add to the user
    extend input CreateUserInput {
      firstName: String!
      lastName: String!
    }

    extend type User {
      firstName: String!
      lastName: String!
    }
  `;

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
    schemaBuilder: ({ typeDefs: accountsTypeDefs, resolvers }) =>
      authDirectiveTransformer(
        makeExecutableSchema({
          typeDefs: mergeTypeDefs([...accountsTypeDefs, typeDefs, authDirectiveTypeDefs]),
          resolvers,
        })
      ),
  });

  await accounts.listen();
})();
