import { createModule, gql, type Module, type Provider } from 'graphql-modules';
import { DatabaseInterfaceSessionsToken, DatabaseInterfaceUserToken } from '@accounts/server';
import { DatabaseType } from '@accounts/types';
import {
  AccountsMongoConfigToken,
  type AccountsMongoOptions,
  Mongo,
  MongoConnectionToken,
} from '@accounts/mongo';
import { MongoClient } from 'mongodb';

export interface AccountsMongoModuleConfig extends AccountsMongoOptions {
  dbConn?: any;
  storage?: {
    uri?: string;
    name?: string;
  };
  type?: DatabaseType;
}

export function createAccountsMongoModule(
  arg?: AccountsMongoModuleConfig & { dbConn?: undefined }
): Promise<Module>;
export function createAccountsMongoModule(arg: AccountsMongoModuleConfig & { dbConn: any }): Module;
export function createAccountsMongoModule({
  type = DatabaseType.Both,
  dbConn,
  storage: { uri = 'mongodb://localhost:27017', name = 'accounts-js' } = {},
  ...config
}: AccountsMongoModuleConfig = {}): Module | Promise<Module> {
  const getModule = (conn: any) =>
    createModule({
      typeDefs: gql`
        extend type Query {
          _accounts_mongo: String
        }
      `,
      id: `accounts-mongo-${type}`,
      providers: () => {
        const providers: Provider[] = [
          {
            provide: AccountsMongoConfigToken,
            useValue: config,
          },
          {
            provide: MongoConnectionToken,
            useValue: conn,
          },
        ];
        if (type !== DatabaseType.Sessions) {
          providers.push({
            provide: DatabaseInterfaceUserToken,
            useClass: Mongo,
            global: true,
          });
        }
        if (type !== DatabaseType.User) {
          providers.push({
            provide: DatabaseInterfaceSessionsToken,
            ...(type === DatabaseType.Sessions ? { useClass: Mongo } : { useValue: undefined }),
            global: true,
          });
        }
        return providers;
      },
    });

  return dbConn
    ? getModule(dbConn)
    : new Promise<Module>((resolve) => {
        MongoClient.connect(uri).then((client) => {
          resolve(getModule(client.db(name)));
        });
      });
}
