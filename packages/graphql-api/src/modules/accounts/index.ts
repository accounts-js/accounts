import AccountsPassword from '@accounts/password';
import { AccountsServer } from '@accounts/server';
import { User } from '@accounts/types';
import { GraphQLModule } from '@graphql-modules/core';
import { mergeTypeDefs } from 'graphql-toolkit';
import { IncomingMessage } from 'http';

import { context } from '../../utils';
import { AuthenticatedDirective } from '../../utils/authenticated-directive';
import { AccountsPasswordModule } from '../accounts-password';
import { LoginResult as LoginResultResolvers } from './resolvers/loginResult';
import { Mutation } from './resolvers/mutation';
import { Query } from './resolvers/query';
import { User as UserResolvers } from './resolvers/user';
import getMutationTypeDefs from './schema/mutation';
import getQueryTypeDefs from './schema/query';
import getSchemaDef from './schema/schema-def';
import TypesTypeDefs from './schema/types';

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
  userAsInterface?: boolean;
  excludeAddUserInContext?: boolean;
}

export interface AccountsModuleContext<IUser = User> {
  authToken?: string;
  userAgent: string;
  ip: string;
  user?: IUser;
  userId?: string;
}

// You can see the below. It is really easy to create a reusable GraphQL-Module with different configurations

export const AccountsModule: GraphQLModule<
  AccountsModuleConfig,
  AccountsRequest,
  AccountsModuleContext
> = new GraphQLModule<AccountsModuleConfig, AccountsRequest, AccountsModuleContext>({
  name: 'accounts',
  typeDefs: ({ config }) =>
    mergeTypeDefs(
      [
        TypesTypeDefs(config),
        getQueryTypeDefs(config),
        getMutationTypeDefs(config),
        ...getSchemaDef(config),
      ],
      {
        useSchemaDefinition: config.withSchemaDefinition,
      }
    ),
  resolvers: ({ config }) =>
    ({
      [config.rootQueryName || 'Query']: Query,
      [config.rootMutationName || 'Mutation']: Mutation,
      User: UserResolvers,
      LoginResult: LoginResultResolvers,
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
  context: context('accounts'),
  schemaDirectives: {
    auth: AuthenticatedDirective,
  },
  configRequired: true,
});
