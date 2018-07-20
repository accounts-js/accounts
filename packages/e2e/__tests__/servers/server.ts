import * as mongoose from 'mongoose';
import { ApolloServer, gql } from 'apollo-server';
import { merge } from 'lodash';
import fetch from 'node-fetch';

// Server
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
// TODO rename to AccountsMongo ?
import { Mongo } from '@accounts/mongo';
import { createAccountsGraphQL, accountsContext } from '@accounts/graphql-api';

// Client
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { AccountsGraphQLClient } from '@accounts/graphql-client';

import ApolloClient from 'apollo-boost';

(global as any).fetch = fetch;

interface ServerTestInterface {
  /**
   * The server
   */
  accountsServer: AccountsServer;
  /**
   * The server password service
   */
  accountsPassword: AccountsPassword;

  /**
   * The client
   */
  accountsClient: AccountsClient;
  /**
   * The client password service
   */
  accountsClientPassword: AccountsClientPassword;

  /**
   * - create server
   * - setup databases connections
   * - cleanup database
   * - initiate the accounts-js server and the services
   */
  start: () => Promise<void>;
  /**
   * - stop server
   * - stop databases connection
   * - cleanup database
   */
  stop: () => Promise<void>;
}

const connectionString = 'mongodb://localhost/accounts-js-tests-e2e';
const urlString = 'http://localhost:4000';

export class ServerTest implements ServerTestInterface {
  public accountsServer: AccountsServer;
  public accountsPassword: AccountsPassword;

  public accountsClient: AccountsClient;
  public accountsClientPassword: AccountsClientPassword;

  private accountsMongo: Mongo;
  private apolloServer: ApolloServer;

  constructor() {
    this.accountsMongo = new Mongo(mongoose.connection);
    this.accountsPassword = new AccountsPassword();
    this.accountsServer = new AccountsServer(
      {
        db: this.accountsMongo,
        tokenSecret: 'test',
      },
      {
        password: this.accountsPassword,
      }
    );
    const accountsGraphQL = createAccountsGraphQL(this.accountsServer);

    const typeDefs = gql`
      type Query {
        _: Boolean
      }
      type Mutation {
        _: Boolean
      }
    `;
    this.apolloServer = new ApolloServer({
      typeDefs: [gql(accountsGraphQL.typeDefs), typeDefs],
      resolvers: merge(accountsGraphQL.resolvers),
      context: ({ req }: any) => ({
        ...accountsContext(req),
      }),
    });

    const apolloClient = new ApolloClient({ uri: urlString });

    const accountsClientGraphQL = new AccountsGraphQLClient({
      graphQLClient: apolloClient,
    });
    this.accountsClient = new AccountsClient({}, accountsClientGraphQL);
    this.accountsClientPassword = new AccountsClientPassword(this.accountsClient);
  }

  public async start() {
    await this.apolloServer.listen();
    (mongoose as any).Promise = global.Promise;
    await mongoose.connect(connectionString);
    await mongoose.connection.dropDatabase();
  }

  public async stop() {
    await this.apolloServer.stop();
    await mongoose.connection.close();
  }
}
