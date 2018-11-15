import { GraphQLModule } from '@graphql-modules/core';
import { AccountsPassword } from '@accounts/password';
import TypesTypeDefs from './schema/types';
import getQueryTypeDefs from './schema/query';
import getMutationTypeDefs from './schema/mutation';
import getSchemaDef from './schema/schema-def';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import { AccountsRequest } from '../accounts';
// tslint:disable-next-line:no-implicit-dependencies
import { mergeGraphQLSchemas } from '@graphql-modules/epoxy';

export interface AccountsPasswordModuleConfig {
  accountsPassword: AccountsPassword;
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
  withSchemaDefinition?: boolean;
}

export const AccountsPasswordModule = new GraphQLModule<
  AccountsPasswordModuleConfig,
  AccountsRequest
>({
  name: 'accounts-password',
  typeDefs: ({ _moduleConfig }) =>
    mergeGraphQLSchemas([
      TypesTypeDefs,
      getQueryTypeDefs(_moduleConfig),
      getMutationTypeDefs(_moduleConfig),
      ...(_moduleConfig.withSchemaDefinition ? [getSchemaDef(_moduleConfig)] : []),
    ]),
  resolvers: ({ _moduleConfig }) =>
    ({
      [_moduleConfig.rootQueryName || 'Query']: Query,
      [_moduleConfig.rootMutationName || 'Mutation']: Mutation,
    } as any),
  providers: ({ _moduleConfig }) => [
    {
      provide: AccountsPassword,
      useValue: _moduleConfig.accountsPassword,
    },
  ],
});
