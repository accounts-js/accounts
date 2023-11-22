import 'reflect-metadata';
import fetch from 'node-fetch';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { schemaFromExecutor } from '@graphql-tools/wrap';
import { stitchSchemas } from '@graphql-tools/stitch';
import { type AsyncExecutor } from '@graphql-tools/utils';
import { OperationTypeNode, print } from 'graphql';
import {
  authDirective,
  authenticated,
  context,
  createAccountsCoreModule,
} from '@accounts/module-core';
import { delegateToSchema } from '@graphql-tools/delegate';
import { createApplication, createModule, gql } from 'graphql-modules';
import { AuthenticationServicesToken } from '@accounts/server';
import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { useGraphQLModules } from '@envelop/graphql-modules';

const accountsServerUri = 'http://localhost:4003/graphql';

(async () => {
  const myTypeDefs = gql`
    type PrivateType @auth {
      field: String
    }

    extend type Query {
      # Example of how to delegate to another field of the remote schema. Returns the currently logged in user or null.
      me: User
      # Returns the currently logged in userId directly from the context without querying the remote schema.
      myId: ID
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

  const myResolvers = {
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
      myId: (parent, args, context) => context.userId,
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
      createModule({
        id: 'app',
        typeDefs: myTypeDefs,
        resolvers: myResolvers,
      }),
    ],
    providers: [
      {
        provide: AuthenticationServicesToken,
        useValue: {},
        global: true,
      },
    ],
    schemaBuilder: ({ typeDefs, resolvers }) =>
      authDirectiveTransformer(
        stitchSchemas({
          subschemas: [remoteSubschema],
          typeDefs: mergeTypeDefs([typeDefs, authDirectiveTypeDefs]),
          resolvers,
        })
      ),
  });

  const { createOperationController } = app;

  const yoga = createYoga({
    plugins: [useGraphQLModules(app)],
    context: (ctx) => context(ctx, { createOperationController }),
  });

  const server = createServer(yoga);

  server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql');
  });
})();
