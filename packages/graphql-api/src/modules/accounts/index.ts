import { GraphQLModule, ModuleConfig } from '@graphql-modules/core';
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
import { getClientIp } from 'request-ip';

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

export const AccountsModule = new GraphQLModule<
  AccountsModuleConfig,
  AccountsRequest,
  AccountsModuleContext
>({
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
            accountsPassword: config.accountsServer.getServices().password as any,
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
  context: async ({ req }, _, { injector }) => {
    const config: AccountsModuleConfig = injector.get(ModuleConfig(AccountsModule));
    const headerName = config.headerName || 'accounts-access-token';
    const authToken = (req.headers[headerName] || req.headers[headerName.toLowerCase()]) as string;
    let user;

    if (authToken) {
      try {
        user = await config.accountsServer.resumeSession(authToken);
      } catch (error) {
        // Empty catch
      }
    }

    let userAgent: string = (req.headers['user-agent'] as string) || '';
    if (req.headers['x-ucbrowser-ua']) {
      // special case of UC Browser
      userAgent = req.headers['x-ucbrowser-ua'] as string;
    }

    return {
      authToken,
      userAgent,
      ip: getClientIp(req),
      user,
      userId: user && user.id,
    };
  },
  directiveResolvers: {
    auth: async (next, src, args, context) => {
      if (context && context.skipJSAccountsVerification === true) {
        return next();
      }
      if (!context.userId && !context.user) {
        throw new Error('Unauthorized');
      }
      return next();
    },
  },
});
