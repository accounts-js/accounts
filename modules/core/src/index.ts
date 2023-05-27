import { createModule, Provider } from 'graphql-modules';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { User, IContext } from '@accounts/types';
import {
  AccountsServer,
  AccountsServerOptions,
  AccountsCoreConfigToken,
  DatabaseInterfaceUserToken,
  DatabaseInterfaceSessionsToken,
} from '@accounts/server';
import TypesTypeDefs from './schema/types';
import getQueryTypeDefs from './schema/query';
import getMutationTypeDefs from './schema/mutation';
import getSchemaDef from './schema/schema-def';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import makeSchema from './schema/schema';

export * from './utils';
export * from './models';

export interface AccountsCoreModuleConfig extends AccountsServerOptions {
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
  withSchemaDefinition?: boolean;
  userAsInterface?: boolean;
}

export type AccountsContextGraphQLModules<IUser extends User = User> = IContext<IUser> &
  GraphQLModules.ModuleContext;

export const createAccountsCoreModule = (config: AccountsCoreModuleConfig) =>
  createModule({
    id: 'accounts-core',
    typeDefs: mergeTypeDefs(
      [
        makeSchema(config),
        TypesTypeDefs,
        getQueryTypeDefs(config),
        getMutationTypeDefs(config),
        ...getSchemaDef(config),
      ],
      {
        useSchemaDefinition: config.withSchemaDefinition,
      }
    ),
    resolvers: {
      [config.rootQueryName || 'Query']: Query,
      [config.rootMutationName || 'Mutation']: Mutation,
    },
    providers: () => {
      const providers: Provider[] = [
        {
          provide: AccountsCoreConfigToken,
          useValue: config,
        },
        AccountsServer,
      ];
      if (config.micro) {
        providers.push(
          {
            provide: DatabaseInterfaceUserToken,
            useValue: {},
            global: true,
          },
          {
            provide: DatabaseInterfaceSessionsToken,
            useValue: undefined,
            global: true,
          }
        );
      }
      return providers;
    },
  });
