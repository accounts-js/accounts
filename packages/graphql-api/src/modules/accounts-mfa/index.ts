import { GraphQLModule } from '@graphql-modules/core';
import { AccountsServer } from '@accounts/server';
import TypesTypeDefs from './schema/types';
import getQueryTypeDefs from './schema/query';
import getMutationTypeDefs from './schema/mutation';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import { AccountsRequest } from '../accounts';
import { context } from '../../utils';
import { CoreAccountsModule } from '../core';

export interface AccountsMfaModuleConfig {
  accountsServer: AccountsServer;
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
  withSchemaDefinition?: boolean;
  headerName?: string;
  userAsInterface?: boolean;
  excludeAddUserInContext?: boolean;
}

export const AccountsMfaModule = new GraphQLModule<AccountsMfaModuleConfig, AccountsRequest>({
  name: 'accounts-mfa',
  typeDefs: ({ config }) => [TypesTypeDefs, getQueryTypeDefs(config), getMutationTypeDefs(config)],
  resolvers: ({ config }) =>
    ({
      [config.rootQueryName || 'Query']: Query,
      [config.rootMutationName || 'Mutation']: Mutation,
    } as any),
  imports: ({ config }) => [
    CoreAccountsModule.forRoot({
      userAsInterface: config.userAsInterface,
    }),
  ],
  providers: ({ config }) => [
    {
      provide: AccountsServer,
      useValue: config.accountsServer,
    },
  ],
  context: context('accounts-mfa'),
  configRequired: true,
});
