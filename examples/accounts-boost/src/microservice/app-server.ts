import accountsBoost from '@accounts/boost';
import {
  makeExecutableSchema,
  mergeSchemas,
  makeRemoteExecutableSchema,
  introspectSchema,
} from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import { ApolloServer } from 'apollo-server';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

const accountsServerUri = 'http://localhost:4003/';

(async () => {
  const accounts = (await accountsBoost({
    tokenSecret: 'terrible secret',
    micro: true, // setting micro to true will instruct `@accounts/boost` to only verify access tokens without any additional session logic
  })).graphql();

  // Note: the following steps are optional and only required if you want to stitch the remote accounts schema with your apps schema.

  // Creates a link to fetch the remote schema from the accounts microservice.

  const http = new HttpLink({ uri: accountsServerUri, fetch });

  const link = setContext((request, previousContext) => {
    if (!previousContext.graphqlContext) {
      return {};
    }
    // Attach the accounts-access-token to requests which are proxied to the remote schema.
    // This step is optional and only required if you want the `getUser` query to return data.
    return {
      headers: {
        'accounts-access-token': previousContext.graphqlContext.authToken,
      },
    };
  }).concat(http);

  const remoteSchema = await introspectSchema(link);

  const executableRemoteSchema = makeRemoteExecutableSchema({
    schema: remoteSchema,
    link,
  });

  const typeDefs = `
    type PrivateType @auth {
      privateField: String
    }

    type Query {
      publicField: String
      privateField: String @auth
      privateType: PrivateType
      privateFieldWithAuthResolver: String
    }

    type Mutation {
      privateMutation: String @auth
      publicMutation: String
    }    
    `;

  const resolvers = {
    PrivateType: {
      privateField: () => 'private',
    },
    Query: {
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => '',
      privateFieldWithAuthResolver: accounts.auth((root, args, context) => {
        return 'private';
      }),
    },
    Mutation: {
      privateMutation: () => 'private',
      publicMutation: () => 'public',
    },
  };

  const executableLocalSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const apolloServer = await new ApolloServer({
    schema: mergeSchemas({
      schemas: [executableLocalSchema, executableRemoteSchema],
      schemaDirectives: {
        // In order for the `@auth` directive to work
        ...accounts.schemaDirectives,
      },
    }),
    context: ({ req }) => accounts.context(req),
  }).listen();

  console.log(`GraphQL server running at ${apolloServer.url}`);
})();
