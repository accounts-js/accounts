import accountsBoost, { authenticated } from '@accounts/boost';
import { mergeTypeDefs, mergeResolvers } from 'graphql-toolkit';
import { ApolloServer } from 'apollo-server';

(async () => {
  const accounts = (
    await accountsBoost({
      tokenSecret: 'terrible secret',
    })
  ).graphql();

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
      privateFieldWithAuthResolver: authenticated((root, args, context) => {
        return 'private';
      }),
    },
    Mutation: {
      privateMutation: () => 'private',
      publicMutation: () => 'public',
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs: mergeTypeDefs([typeDefs, accounts.typeDefs]),
    resolvers: mergeResolvers([accounts.resolvers, resolvers]),
    schemaDirectives: {
      // In order for the `@auth` directive to work
      ...accounts.schemaDirectives,
    },
    context: ({ req }) => accounts.context({ req }),
  } as any)
    .listen()
    .then((res) => {
      console.log(`GraphQL server running at ${res.url}`);
    });
})();
