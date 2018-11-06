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
import { mergeGraphQLSchemas } from '@graphql-modules/epoxy';
import { AccountsPasswordModule } from '../accounts-password';
import AccountsPassword from '@accounts/password';
import { AuthenticatedDirective } from '../../utils/authenticated-directive';

export interface IAccountsRequest {
  req: IncomingMessage;
}

export interface IAccountsModuleConfig {
  accountsServer: AccountsServer;
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
  withSchemaDefinition?: boolean;
  headerName?: string;
}

export interface IAccountsModuleContext {
  authToken?: string;
  userAgent: string;
  ip: string;
  user?: User;
  userId?: string;
}

// You can see the below. It is really easy to create a reusable GraphQL-Module with different configurations

export const AccountsModule = new GraphQLModule<
  IAccountsModuleConfig,
  IAccountsRequest,
  IAccountsModuleContext
>({
  name: 'accounts',
  typeDefs: ({ config }) =>
    mergeGraphQLSchemas([
      TypesTypeDefs,
      getQueryTypeDefs(config),
      getMutationTypeDefs(config),
      ...(config.withSchemaDefinition ? [getSchemaDef(config)] : []),
    ]),
  resolvers: ({ config }) =>
    ({
      [config.rootQueryName || 'Query']: Query,
      [config.rootMutationName || 'Mutation']: Mutation,
    } as any),
  // If necessary, import AccountsPasswordModule together with this module
  imports: ({ config }) =>
    config.accountsServer.getServices().password
      ? [
          AccountsPasswordModule.forRoot({
            accountsPassword: config.accountsServer.getServices().password as AccountsPassword,
            ...config,
          }),
        ]
      : [],
  providers: ({ config }) => [
    {
      provide: AccountsServer,
      useValue: config.accountsServer,
    },
  ],
  contextBuilder,
  schemaDirectives: {
    auth: AuthenticatedDirective,
  },
});
