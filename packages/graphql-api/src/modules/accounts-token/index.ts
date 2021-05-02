import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { AccountsToken } from '@accounts/token';
import { GraphQLModule } from '@graphql-modules/core';
import { AccountsRequest } from '../accounts';
import getMutationTypeDefs from './schema/mutation';
import { Mutation } from './resolvers/mutation';
import { CoreAccountsModule } from '../core';
import { context } from '../../utils';

export interface AccountsTokenModuleConfig {
  accountsServer: AccountsServer;
  accountsPassword: AccountsPassword;
  accountsToken: AccountsToken;
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
  withSchemaDefinition?: boolean;
  headerName?: string;
  userAsInterface?: boolean;
  excludeAddUserInContext?: boolean;
}

export const AccountsTokenModule: GraphQLModule<
  AccountsTokenModuleConfig,
  AccountsRequest
> = new GraphQLModule<AccountsTokenModuleConfig, AccountsRequest>({
  name: 'accounts-token',
  typeDefs: ({ config }) => [getMutationTypeDefs(config)],
  resolvers: ({ config }) =>
    ({
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
    {
      provide: AccountsToken,
      useValue: config.accountsToken,
    },
  ],
  context: context('accounts-token'),
  configRequired: true,
});
