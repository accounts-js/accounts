import 'reflect-metadata';
import fetch from 'node-fetch';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { schemaFromExecutor } from '@graphql-tools/wrap';
import { stitchSchemas } from '@graphql-tools/stitch';
import { AsyncExecutor } from '@graphql-tools/utils';
import { OperationTypeNode, print } from 'graphql';
import {
  authDirective,
  authenticated,
  context,
  createAccountsCoreModule,
} from '@accounts/module-core';
import { createAccountsPasswordModule } from '@accounts/module-password';
import { delegateToSchema } from '@graphql-tools/delegate';
import { createApplication, createModule, gql } from 'graphql-modules';
import { AuthenticationServicesToken } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';

const accountsServerUri = 'http://localhost:4003/';

(async () => {
  const typeDefs = gql`
    type PrivateType @auth {
      field: String
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
      me: {
        resolve: (parent, args, context, info) => {
          return delegateToSchema({
            schema: remoteSubschema,
            operation: OperationTypeNode.QUERY,
            fieldName: 'getUser',
            args,
            context,
            info,
          });
        },
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

  // // Note: the following steps are optional and only required if you want to stitch the remote accounts schema with your apps schema.

  const remoteExecutor: AsyncExecutor = async ({ document, variables, context }) => {
    console.log('context: ', context);
    const query = print(document);
    const fetchResult = await fetch(accountsServerUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Attach the Authorization to requests which are proxied to the remote schema.
        // This step is optional and only required if you want the `getUser` query to return data.
        ...(context?.authToken && { Authorization: `Bearer ${context.authToken}` }),
      },
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };

  const remoteSubschema = {
    schema: await schemaFromExecutor(remoteExecutor),
    executor: remoteExecutor,
  };

  const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective('auth');

  const app = createApplication({
    modules: [
      createAccountsCoreModule({
        tokenSecret: 'secret',
        // setting micro to true will instruct accounts-js to only
        // verify access tokens without any additional session logic
        micro: true,
      }),
      createAccountsPasswordModule(),
      createModule({ id: 'app', typeDefs }),
    ],
    providers: [
      {
        provide: AuthenticationServicesToken,
        useValue: { password: AccountsPassword },
        global: true,
      },
    ],
    schemaBuilder: () =>
      authDirectiveTransformer(
        stitchSchemas({
          subschemas: [remoteSubschema],
          typeDefs: mergeTypeDefs([typeDefs, authDirectiveTypeDefs]),
          resolvers,
        })
      ),
  });

  const schema = app.createSchemaForApollo();

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
    context: (ctx) => context(ctx, { app }),
  });

  console.log(`🚀  Server ready at ${url}`);
})();
