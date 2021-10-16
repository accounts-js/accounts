import { AccountsMagicLink } from '@accounts/magic-link';
import { createModule } from 'graphql-modules';
import getMutationTypeDefs from './schema/mutation';
import { Mutation } from './resolvers/mutation';

export interface AccountsMagicLinkModuleConfig {
  accountsMagicLink: AccountsMagicLink;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
}

export const createAccountsMagicLinkModule = (config: AccountsMagicLinkModuleConfig) =>
  createModule({
    id: 'accounts-magic-link',
    typeDefs: [getMutationTypeDefs(config)],
    resolvers: {
      [config.rootMutationName || 'Mutation']: Mutation,
    },
    providers: [
      {
        provide: AccountsMagicLink,
        useValue: config.accountsMagicLink,
      },
    ],
  });
