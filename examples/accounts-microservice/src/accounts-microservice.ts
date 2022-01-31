import 'reflect-metadata';
import {
  buildSchema,
  context,
  createAccountsCoreModule,
  createAccountsPasswordModule,
} from '@accounts/graphql-api';
import { createAccountsMongoModule } from '@accounts/module-mongo';
import { ApolloServer, gql } from 'apollo-server';
import { createApplication, createModule } from 'graphql-modules';
import { AuthenticationServicesToken } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';

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
      await createAccountsMongoModule(),
      createModule({ id: 'app', typeDefs }),
    ],
    providers: [
      {
        provide: AuthenticationServicesToken,
        useValue: { password: AccountsPassword },
        global: true,
      },
    ],
    schemaBuilder: buildSchema({ typeDefs }),
  });

  // Create the Apollo Server that takes a schema and configures internal stuff
  const server = new ApolloServer({
    schema: app.createSchemaForApollo(),
    context: async ({ req }) => context({ req }, { injector: app.injector }),
  });

  server.listen(4003).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
})();
