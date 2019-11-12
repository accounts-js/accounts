import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import { mergeTypeDefs, mergeResolvers } from 'graphql-toolkit';

import { AccountsModule } from '@accounts/graphql-api';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer } from '@accounts/server';
import { AccountsTypeorm } from '@accounts/typeorm';
import { connect } from './connect';

export const createAccounts = async () => {
  const connection = await connect(process.env.DATABASE_URL);
  // Like, fix this man!
  const tokenSecret = 'process.env.ACCOUNTS_SECRET' || 'change this in .env';
  const db = new AccountsTypeorm({ connection, cache: 1000 });
  const password = new AccountsPassword();
  const accountsServer = new AccountsServer(
    {
      db,
      tokenSecret,
      siteUrl: 'http://localhost:3000',
    },
    { password }
  );
  // Creates resolvers, type definitions, and schema directives used by accounts-js
  const accountsGraphQL = AccountsModule.forRoot({
    accountsServer,
  });

  const typeDefs = `
type PrivateType @auth {
field: String
}

# Our custom fields to add to the user
extend input CreateUserInput {
profile: CreateUserProfileInput!
}

input CreateUserProfileInput {
firstName: String!
lastName: String!
}

type Query {
publicField: String
privateField: String @auth
privateType: PrivateType
}

type Mutation {
_: String
}
`;

  const resolvers = {
    Query: {
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => ({
        field: () => 'private',
      }),
    },
  };

  const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([typeDefs, accountsGraphQL.typeDefs]) as any,
    resolvers: mergeResolvers([accountsGraphQL.resolvers as any, resolvers]) as any,
    schemaDirectives: {
      ...accountsGraphQL.schemaDirectives,
    },
  });

  // Create the Apollo Server that takes a schema and configures internal stuff
  const server = new ApolloServer({
    schema,
    context: accountsGraphQL.context,
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};
createAccounts();
