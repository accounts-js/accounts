import 'reflect-metadata';
import {
  authenticated,
  buildSchema,
  context,
  createAccountsCoreModule,
} from '@accounts/module-core';
import { createAccountsPasswordModule } from '@accounts/module-password';
import {
  AccountsPassword,
  infosMiddleware,
  resetPassword,
  resetPasswordForm,
  verifyEmail,
} from '@accounts/password';
import { AccountsServer, AuthenticationServicesToken, ServerHooks } from '@accounts/server';
import gql from 'graphql-tag';
import mongoose from 'mongoose';
import { createApplication } from 'graphql-modules';
import { createAccountsMongoModule } from '@accounts/module-mongo';
import { createYoga } from 'graphql-yoga';
import { useGraphQLModules } from '@envelop/graphql-modules';
import express from 'express';
import helmet from 'helmet';

void (async () => {
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
          return ctx.injector.get(AccountsServer).findUserById(ctx.userId);
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

  const port = 4000;
  const siteUrl = `http://localhost:${port}`;
  const app = createApplication({
    modules: [
      createAccountsCoreModule({ tokenSecret: 'secret', siteUrl }),
      createAccountsPasswordModule({
        requireEmailVerification: true,
        sendVerificationEmailAfterSignup: true,
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

  const { injector, createOperationController } = app;

  injector.get(AccountsServer).on(ServerHooks.ValidateLogin, ({ user }) => {
    // This hook is called every time a user try to login.
    // You can use it to only allow users with verified email to login.
    // If you throw an error here it will be returned to the client.
    console.log(`${user.firstName} ${user.lastName} logged in`);
  });

  // Create a Yoga instance with a GraphQL schema.
  const yoga = createYoga({
    plugins: [useGraphQLModules(app)],
    context: (ctx) => context(ctx, { createOperationController }),
  });

  const yogaRouter = express.Router();
  // GraphiQL specefic CSP configuration
  yogaRouter.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'style-src': ["'self'", 'unpkg.com'],
          'script-src': ["'self'", 'unpkg.com', "'unsafe-inline'"],
          'img-src': ["'self'", 'raw.githubusercontent.com'],
        },
      },
    })
  );
  yogaRouter.use(yoga);

  const router = express.Router();
  // By adding the GraphQL Yoga router before the global helmet middleware,
  // you can be sure that the global CSP configuration will not be applied to the GraphQL Yoga endpoint
  router.use(yoga.graphqlEndpoint, yogaRouter);
  // Add the global CSP configuration for the rest of your server.
  router.use(helmet());
  router.use(express.urlencoded({ extended: true }));

  router.use(infosMiddleware);
  router.get('/verify-email/:token', verifyEmail(app.injector));
  router.get('/reset-password/:token', resetPasswordForm);
  router.post('/resetPassword', resetPassword(app.injector));

  const expressApp = express();
  expressApp.use(router);

  // Start the server and you're done!
  expressApp.listen(port, () => {
    console.info(`Server is running on ${siteUrl}/graphql`);
  });
})();
