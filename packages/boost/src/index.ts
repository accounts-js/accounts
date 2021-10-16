import { DatabaseManager } from '@accounts/database-manager';
import {
  createAccountsCoreModule,
  createAccountsPasswordModule,
  authenticated,
  context,
  authDirective,
} from '@accounts/graphql-api';
import { AccountsServer, AccountsServerOptions } from '@accounts/server';
import { AuthenticationService } from '@accounts/types';
import { ApolloServer, ServerInfo } from 'apollo-server';
import { verify } from 'jsonwebtoken';
import { get, isString, merge } from 'lodash';
import { Application, createApplication, ApplicationConfig } from 'graphql-modules';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs } from '@graphql-tools/merge';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';

export { createAccountsCoreModule, createAccountsPasswordModule };

export { AccountsServerOptions };

export { authenticated };

export interface AccountsBoostOptions extends AccountsServerOptions {
  storage?: {
    uri?: string;
    name?: string;
  };
  services?: { [key: string]: object };
  micro?: boolean;
  schemaBuilder?: ApplicationConfig['schemaBuilder'];
}

const defaultAccountsBoostOptions = {
  storage: {
    uri: 'mongodb://localhost:27017',
    name: 'accounts-js',
  },
};

const requirePackage = (packageName: string) => {
  if (require.resolve(packageName)) {
    return require(packageName);
  }
};

export const accountsBoost = async (userOptions?: AccountsBoostOptions): Promise<AccountsBoost> => {
  const options = merge({}, defaultAccountsBoostOptions, userOptions);

  const databasePackages = {
    ['@accounts/mongo']: async (requiredPackage: any): Promise<any> => {
      // The `@accounts/mongo` package comes with the `mongodb` driver
      // eslint-disable-next-line
      const mongodb = require('mongodb');

      const mongoClient = (await mongodb.MongoClient.connect(get(options, 'storage.uri'))).db(
        get(options, 'storage.name')
      );

      return new requiredPackage.Mongo(mongoClient, options);
    },
  };

  const storage = await Object.keys(databasePackages).reduce(
    async (res, packageName: string): Promise<any> => {
      const requiredPackage = requirePackage(packageName);
      if (requiredPackage) {
        return (databasePackages as any)[packageName](requiredPackage);
      }
      return res;
    },
    Promise.resolve<any>([])
  );

  if (!storage) {
    throw new Error('A database package could not be loaded. Did you install one?');
  }

  options.db = new DatabaseManager({
    userStorage: storage,
    sessionStorage: storage,
  });

  const servicePackages = {
    ['@accounts/password']: async (requiredPackage: any): Promise<any> => {
      const AccountsPassword = requiredPackage.default;
      return new AccountsPassword(get(options, ['services', 'password']));
    },
  };

  const services = await Object.keys(servicePackages).reduce(
    async (res, packageName: string): Promise<any> => {
      const requiredPackage = requirePackage(packageName);
      if (requiredPackage) {
        const service = await (servicePackages as any)[packageName](requiredPackage);
        return {
          ...res,
          [service.serviceName]: service,
        };
      }
      return res;
    },
    Promise.resolve({})
  );

  // eslint-disable-next-line
  return new AccountsBoost(options, services);
};

export interface AccountsBoostListenOptions {
  port?: number;
}

const defaultAccountsBoostListenOptions: AccountsBoostListenOptions = {
  port: 4003,
};

export class AccountsBoost {
  public accountsServer: AccountsServer;
  public apolloServer: ApolloServer;
  public application: Application;
  private options: AccountsBoostOptions;

  constructor(options: AccountsBoostOptions, services: { [key: string]: AuthenticationService }) {
    this.accountsServer = new AccountsServer(options, services);
    this.options = options;

    if (this.options.micro) {
      this.accountsServer.resumeSession = async (accessToken: string) => {
        let decoded: any;

        if (!isString(accessToken)) {
          throw new Error('An access token is required');
        }

        try {
          const secretOrPublicKey =
            typeof this.options.tokenSecret === 'string'
              ? this.options.tokenSecret
              : this.options.tokenSecret.publicKey;
          decoded = verify(accessToken, secretOrPublicKey);
        } catch (err) {
          throw new Error('Access token is not valid');
        }

        return {
          id: decoded.data.userId,
        } as any;
      };
    }

    const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective('auth');

    this.application = createApplication({
      modules: [
        createAccountsCoreModule({ accountsServer: this.accountsServer }),
        createAccountsPasswordModule({ accountsPassword: services.password as any }),
      ],
      schemaBuilder:
        options.schemaBuilder ??
        (({ typeDefs: accountsTypeDefs, resolvers }) =>
          authDirectiveTransformer(
            makeExecutableSchema({
              typeDefs: mergeTypeDefs([authDirectiveTypeDefs, ...accountsTypeDefs]),
              resolvers,
            })
          )),
    });

    this.apolloServer = new ApolloServer({
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageGraphQLPlayground(),
      ],
      schema: this.application.createSchemaForApollo(),
      context: ({ req }) => {
        return context(
          { req },
          {
            accountsServer: this.accountsServer,
          }
        );
      },
    });
  }

  public async listen(options?: AccountsBoostListenOptions): Promise<ServerInfo> {
    const res = await this.apolloServer.listen(
      merge({}, defaultAccountsBoostListenOptions, options)
    );

    console.log(`Accounts GraphQL server running at ${res.url}`);

    return res;
  }
}

export default accountsBoost;
