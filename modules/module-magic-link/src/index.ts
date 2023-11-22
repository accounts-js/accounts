import {
  AccountsMagicLink,
  type AccountsMagicLinkOptions,
  AccountsMagicLinkConfigToken,
} from '@accounts/magic-link';
import { createModule } from 'graphql-modules';
import getMutationTypeDefs from './schema/mutation';
import { Mutation } from './resolvers/mutation';

export * from './models';

export interface AccountsMagicLinkModuleConfig extends AccountsMagicLinkOptions {
  rootMutationName?: string;
  extendTypeDefs?: boolean;
}

export const createAccountsMagicLinkModule = (config: AccountsMagicLinkModuleConfig = {}) =>
  createModule({
    id: 'accounts-magic-link',
    typeDefs: [getMutationTypeDefs(config)],
    resolvers: {
      [config.rootMutationName || 'Mutation']: Mutation,
    },
    providers: [
      {
        provide: AccountsMagicLinkConfigToken,
        useValue: config,
      },
      AccountsMagicLink,
    ],
  });
