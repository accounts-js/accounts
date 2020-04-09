import { GraphQLModule } from '@graphql-modules/core';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer } from '@accounts/server';
import TypesTypeDefs from './schema/types';
import getQueryTypeDefs from './schema/query';
import getMutationTypeDefs from './schema/mutation';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import { AccountsRequest } from '../accounts';
import { context } from '../../utils';
import { CoreAccountsModule } from '../core';

export interface AccountsPasswordModuleConfig {
  accountsServer: AccountsServer;
  accountsPassword: AccountsPassword;
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
  withSchemaDefinition?: boolean;
  headerName?: string;
  userAsInterface?: boolean;
  excludeAddUserInContext?: boolean;
}

export const AccountsPasswordModule = new GraphQLModule<
  AccountsPasswordModuleConfig,
  AccountsRequest
>({
  name: 'accounts-password',
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
    {
      provide: AccountsPassword,
      useValue: config.accountsPassword,
    },
  ],
  context: context('accounts-password'),
  configRequired: true,
});
