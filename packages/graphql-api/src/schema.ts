import { AccountsModule } from './modules';
import { makeExecutableSchema } from 'graphql-tools';

// It is really easy to create typings with GraphQL-Modules and GraphQL Code Generator

const { typeDefs } = AccountsModule.forRoot({
  accountsServer: {
    getServices: () => ({
      password: {},
    }),
  } as any,
});

export const schema = makeExecutableSchema({
  typeDefs,
});
