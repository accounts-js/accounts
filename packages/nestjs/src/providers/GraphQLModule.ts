import { AccountsModule } from '@accounts/graphql-api';
import AccountsServer from '@accounts/server';
import { FactoryProvider } from '@nestjs/common/interfaces';
import { NestAccountsOptions } from '../interfaces/AccountsNestModuleOptions';
import { ACCOUNTS_JS_GRAPHQL, ACCOUNTS_JS_OPTIONS, ACCOUNTS_JS_SERVER } from '../utils/accounts.constants';

export const GraphQLModuleProvider: FactoryProvider<typeof AccountsModule> = {
  provide: ACCOUNTS_JS_GRAPHQL,
  useFactory: (options: NestAccountsOptions, accountsServer: AccountsServer) => {
    let { GraphQL = false } = options;

    if (!GraphQL) {
      return null;
    } else if (GraphQL === true) {
      GraphQL = {};
    }

    return AccountsModule.forRoot({ accountsServer, ...GraphQL });
  },
  inject: [ACCOUNTS_JS_OPTIONS, ACCOUNTS_JS_SERVER],
};
