import { createModule } from 'graphql-modules';
import TypesTypeDefs from './schema/types';
import getQueryTypeDefs from './schema/query';
import getMutationTypeDefs from './schema/mutation';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import AccountsPassword, {
  AccountsPasswordConfigToken,
  AccountsPasswordOptions,
} from '@accounts/password';

export * from './models';

export interface AccountsPasswordModuleConfig extends AccountsPasswordOptions {
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
}

export const createAccountsPasswordModule = (config: AccountsPasswordModuleConfig = {}) =>
  createModule({
    id: 'accounts-password',
    typeDefs: [TypesTypeDefs, getQueryTypeDefs(config), getMutationTypeDefs(config)],
    resolvers: {
      [config.rootQueryName || 'Query']: Query,
      [config.rootMutationName || 'Mutation']: Mutation,
    },
    providers: [
      {
        provide: AccountsPasswordConfigToken,
        useValue: config,
      },
      AccountsPassword,
    ],
  });
