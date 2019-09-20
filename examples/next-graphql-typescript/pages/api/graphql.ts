import { AccountsModule, authenticated } from '@accounts/graphql-api';
import AccountsPassword from '@accounts/password';
import AccountsServer from '@accounts/server';
import { AccountsTypeorm } from '@accounts/typeorm';
import { ApolloServer, gql } from 'apollo-server-micro';
import { mergeResolvers, mergeTypeDefs } from 'graphql-toolkit';
import initCors from 'micro-cors';
import { getConnectionManager } from 'typeorm';

const typeDefs = gql`
  type PrivateType @auth {
    privateField: String
  }

  type Query {
    publicField: String
    privateField: String @auth
    privateType: PrivateType @auth
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

const connectionManager = getConnectionManager();

let connection;

try {
  connection = connectionManager.create({
    type: 'postgres',
    url: 'postgres://postgres@localhost:5432/postgres',
    entities: [...require('@accounts/typeorm').entities],
    synchronize: true,
  });
} catch (err) {
  if (err.name === 'AlreadyHasActiveConnectionError') {
    connection = getConnectionManager().get('default');
  }
}

// How to use env variables when deploying to zeit https://zeit.co/docs/v2/build-step#using-environment-variables-and-secrets

const tokenSecret = process.env.ACCOUNTS_SECRET || 'terrible secret';

const db = new AccountsTypeorm({
  connection,
  cache: 1000,
});

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

const apolloServer = new ApolloServer({
  typeDefs: mergeTypeDefs([typeDefs, accountsGraphQL.typeDefs]),
  resolvers: mergeResolvers([accountsGraphQL.resolvers, resolvers]),
  schemaDirectives: {
    // In order for the `@auth` directive to work
    ...accountsGraphQL.schemaDirectives,
  },
  context: ({ req }) => accountsGraphQL.context({ req }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = initCors();

export default cors((req, res) => {
  return apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});
