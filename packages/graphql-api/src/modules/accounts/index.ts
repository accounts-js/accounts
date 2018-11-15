import { GraphQLModule } from '@graphql-modules/core';
import { AccountsServer } from '@accounts/server';
import { IncomingMessage } from 'http';
import TypesTypeDefs from './schema/types';
import getQueryTypeDefs from './schema/query';
import getMutationTypeDefs from './schema/mutation';
import getSchemaDef from './schema/schema-def';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import { User } from '@accounts/types';
import { contextBuilder } from './context-builder';
import { AccountsPasswordModule } from '../accounts-password';
import AccountsPassword from '@accounts/password';
import { AuthenticatedDirective } from '../../utils/authenticated-directive';
// tslint:disable-next-line:no-implicit-dependencies
import { mergeGraphQLSchemas } from '@graphql-modules/epoxy';

export interface AccountsRequest {
  req: IncomingMessage;
}

export interface AccountsModuleConfig {
  accountsServer: AccountsServer;
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
  withSchemaDefinition?: boolean;
  headerName?: string;
}

export interface AccountsModuleContext {
  authToken?: string;
  userAgent: string;
  ip: string;
  user?: User;
  userId?: string;
}

// You can see the below. It is really easy to create a reusable GraphQL-Module with different configurations

export const AccountsModule = new GraphQLModule<
  AccountsModuleConfig,
  AccountsRequest,
  AccountsModuleContext
>({
  name: 'accounts',
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
  // If necessary, import AccountsPasswordModule together with this module
  imports: ({ _moduleConfig }) =>
    _moduleConfig.accountsServer.getServices().password
      ? [
          AccountsPasswordModule.forRoot({
            accountsPassword: _moduleConfig.accountsServer.getServices()
              .password as AccountsPassword,
            ..._moduleConfig,
          }),
        ]
      : [],
  providers: ({ _moduleConfig }) => [
    {
      provide: AccountsServer,
      useValue: _moduleConfig.accountsServer,
    },
  ],
  contextBuilder,
  schemaDirectives: {
    auth: AuthenticatedDirective,
  },
});
