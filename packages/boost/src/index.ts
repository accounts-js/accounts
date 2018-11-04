import { AccountsServer, AccountsServerOptions } from '@accounts/server';
import { AuthenticationService } from '@accounts/types';
import { ApolloServer } from 'apollo-server';
import { createAccountsGraphQL, accountsContext, authenticated } from '@accounts/graphql-api';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { merge, get, isString } from 'lodash';
import { DatabaseManager } from '@accounts/database-manager';
import { verify } from 'jsonwebtoken';

export { accountsContext };

export { AccountsServerOptions };

export interface AccountsBoostOptions extends AccountsServerOptions {
  storage?: {
    uri?: string;
    name?: string;
  };
  micro?: boolean;
}

const defaultAccountsBoostOptions = {
  storage: {
    uri: 'mongodb://localhost:27017',
    name: 'accounts-js',
  },
};

export interface AccountsGraphQL {
  schema: GraphQLSchema;
  typeDefs: string;
  resolvers: {
    [x: string]: any;
  };
  schemaDirectives: {
    auth: any;
  };
  context: any;
  auth: any;
}

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
      const mongodb = require('mongodb'); // tslint:disable-line no-implicit-dependencies

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
    Promise.resolve([])
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
  private accountsGraphQL: AccountsGraphQL | undefined;
  private options: AccountsBoostOptions;

  constructor(options: AccountsBoostOptions, services: { [key: string]: AuthenticationService }) {
    this.accountsServer = new AccountsServer(options, services);
    this.options = options;

    this.apolloServer = new ApolloServer({
      schema: this.graphql().schema,
      context: ({ req }: any) => {
        return accountsContext(req, {
          accountsServer: this.accountsServer,
        });
      },
    });
  }

  public async listen(options?: AccountsBoostListenOptions): Promise<any> {
    const res = await this.apolloServer.listen(
      merge({}, defaultAccountsBoostListenOptions, options)
    );

    // tslint:disable-next-line no-console
    console.log(`Accounts GraphQL server running at ${res.url}`);

    return res;
  }

  public graphql(): AccountsGraphQL {
    // Cache `this.accountsGraphQL` to avoid regenerating the schema if the user calls `accountsBoost.graphql()` multple times.
    if (this.accountsGraphQL) {
      return this.accountsGraphQL;
    }

    const accountsGraphQL = createAccountsGraphQL(this.accountsServer, { extend: true });

    const schema = makeExecutableSchema({
      typeDefs: [createAccountsGraphQL(this.accountsServer, { extend: false }).typeDefs],
      resolvers: merge(accountsGraphQL.resolvers),
      schemaDirectives: {
        ...accountsGraphQL.schemaDirectives,
      },
    });

    this.accountsGraphQL = {
      ...accountsGraphQL,
      schema,
      auth: authenticated,
      context: (req: any) => {
        if (this.options.micro) {
          return accountsContext(req, {
            accountsServer: {
              resumeSession: (accessToken: string) => {
                let decoded: any;

                if (!isString(accessToken)) {
                  throw new Error('An access token is required');
                }

                try {
                  decoded = verify(accessToken, this.options.tokenSecret);
                } catch (err) {
                  throw new Error('Access token is not valid');
                }

                return {
                  id: decoded.data.userId,
                };
              },
            } as any,
          });
        }
        return accountsContext(req, {
          accountsServer: this.accountsServer,
        });
      },
    };

    return this.accountsGraphQL as AccountsGraphQL;
  }
}

export default accountsBoost;
