import { GraphQLModule } from '@graphql-modules/core';
import makeSchema from './schema';

export interface CoreAccountsModuleConfig {
  userAsInterface?: boolean;
}

export const CoreAccountsModule = new GraphQLModule<CoreAccountsModuleConfig>({
  typeDefs: ({ config }) => makeSchema(config),
  resolvers: {},
  imports: [],
});
