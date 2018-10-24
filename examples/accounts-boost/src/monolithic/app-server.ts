import accountsBoost from '@accounts/boost';
import { ApolloServer } from 'apollo-server';
import { merge } from 'lodash';

(async () => {
  const accounts = (await accountsBoost({
    tokenSecret: 'terrible secret',
  })).graphql();

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

  const apolloServer = new ApolloServer({
    typeDefs: [typeDefs, accounts.typeDefs],
    resolvers: merge(accounts.resolvers, resolvers),
    schemaDirectives: {
      // In order for the `@auth` directive to work
      ...accounts.schemaDirectives,
    },
    context: ({ req }) => accounts.context(req),
  } as any)
    .listen()
    .then(res => {
      console.log(`GraphQL server running at ${res.url}`);
    });
})();
