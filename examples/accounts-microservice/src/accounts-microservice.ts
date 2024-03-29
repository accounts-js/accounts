import 'reflect-metadata';
import { buildSchema, context, createAccountsCoreModule } from '@accounts/module-core';
import { createAccountsPasswordModule } from '@accounts/module-password';
import { createAccountsMongoModule } from '@accounts/module-mongo';
import { createApplication, createModule, gql } from 'graphql-modules';
import { AuthenticationServicesToken } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { useGraphQLModules } from '@envelop/graphql-modules';

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
    schemaBuilder: buildSchema(),
  });

  const { createOperationController } = app;

  const yoga = createYoga({
    plugins: [useGraphQLModules(app)],
    context: (ctx) => context(ctx, { createOperationController }),
  });

  const server = createServer(yoga);

  server.listen(4003, () => {
    console.info('Server is running on http://localhost:4003/graphql');
  });
})();
