import 'reflect-metadata';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import { mergeTypeDefs, mergeResolvers } from '@graphql-toolkit/schema-merging';
import { AccountsModule } from '@accounts/graphql-api';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer } from '@accounts/server';
import { AccountsMikroOrm, IUser } from '@accounts/mikro-orm';
import { MikroORM } from 'mikro-orm';
import config, { ExtendedUser, ExtendedEmail } from './mikro-orm-config';

export const createAccounts = async () => {
  const tokenSecret = config.password;
  const orm = await MikroORM.init(config);
  const { em } = orm;
  const db = new AccountsMikroOrm({ em, UserEntity: ExtendedUser, EmailEntity: ExtendedEmail });
  const password = new AccountsPassword<IUser>();
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
