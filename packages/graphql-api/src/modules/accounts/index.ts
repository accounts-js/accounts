import { GraphQLModule } from '@graphql-modules/core';
import { AccountsServer } from '@accounts/server';
import { IncomingMessage } from 'http';
import TypesTypeDefs from './schema/types';
import getQueryTypeDefs from './schema/query';
import getMutationTypeDefs from './schema/mutation';
import getSchemaDef from './schema/schema-def';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import { User as UserResolvers } from './resolvers/user';
import { LoginResult as LoginResultResolvers } from './resolvers/loginResult';
import { User } from '@accounts/types';
import { AccountsPasswordModule } from '../accounts-password';
import { AuthenticatedDirective } from '../../utils/authenticated-directive';
import { context } from '../../utils';
import AccountsPassword from '@accounts/password';

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
  typeDefs: ({ config }) => [
    TypesTypeDefs(config),
    getQueryTypeDefs(config),
    getMutationTypeDefs(config),
    ...getSchemaDef(config),
  ],
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
