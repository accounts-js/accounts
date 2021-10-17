import accountsBoost, { authenticated } from '@accounts/boost';
import fetch from 'node-fetch';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { introspectSchema } from '@graphql-tools/wrap';
import { stitchSchemas } from '@graphql-tools/stitch';
import { AsyncExecutor } from '@graphql-tools/utils';
import { print } from 'graphql';
import { authDirective } from '@accounts/graphql-api';
import { gql } from 'apollo-server';
import { delegateToSchema } from '@graphql-tools/delegate';

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
            operation: 'query',
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
    schema: await introspectSchema(remoteExecutor),
    executor: remoteExecutor,
  };

  const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective('auth');

  const accounts = await accountsBoost({
    tokenSecret: 'terrible secret',
    micro: true, // setting micro to true will instruct `@accounts/boost` to only verify access tokens without any additional session logic
    schemaBuilder: () =>
      authDirectiveTransformer(
        stitchSchemas({
          subschemas: [remoteSubschema],
          typeDefs: mergeTypeDefs([typeDefs, authDirectiveTypeDefs]),
          resolvers,
        })
      ),
  });

  accounts.listen({ port: 4000 });
})();
