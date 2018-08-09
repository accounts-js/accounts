import { ApolloServer, gql } from 'apollo-server';
import { merge } from 'lodash';
import fetch from 'node-fetch';

// Server
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { createAccountsGraphQL, accountsContext } from '@accounts/graphql-api';
import { User, DatabaseInterface } from '@accounts/types';

// Client
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { AccountsGraphQLClient } from '@accounts/graphql-client';

import ApolloClient from 'apollo-boost';

import { DatabaseTestInterface } from '../databases';
import { DatabaseTest } from '../databases/mongo';
import { ServerTestInterface } from './index';

(global as any).fetch = fetch;

const urlString = 'http://localhost:4000';

const convertUrlToToken = (url: string): string => {
  const split = url.split('/');
  return split[split.length - 1];
};

export class ServerGraphqlTest implements ServerTestInterface {
  public accountsServer: AccountsServer;
  public accountsPassword: AccountsPassword;
  public accountsDatabase: DatabaseInterface;

  public accountsClient: AccountsClient;
  public accountsClientPassword: AccountsClientPassword;

  public emails: any[];

  private apolloServer: ApolloServer;
  private databaseTest: DatabaseTestInterface;

  constructor() {
    this.databaseTest = new DatabaseTest();
    this.accountsDatabase = this.databaseTest.accountsDatabase;
    this.accountsPassword = new AccountsPassword();
    this.accountsServer = new AccountsServer(
      {
        db: this.accountsDatabase,
        tokenSecret: 'test',
        emailTemplates: {
          from: 'accounts-js <no-reply@accounts-js.com>',
          verifyEmail: {
            subject: () => 'Verify your account email',
            text: (user: User, url: string) => convertUrlToToken(url),
          },
          resetPassword: {
            subject: () => 'Reset your password',
            text: (user: User, url: string) => convertUrlToToken(url),
          },
          enrollAccount: {
            subject: () => 'Set your password',
            text: (user: User, url: string) => convertUrlToToken(url),
          },
        },
        sendMail: async mail => {
          this.emails.push(mail);
        },
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
      context: ({ req }: any) =>
        accountsContext(req, {
          accountsServer: this.accountsServer,
        }),
    });

    const apolloClient = new ApolloClient({ uri: urlString });

    const accountsClientGraphQL = new AccountsGraphQLClient({
      graphQLClient: apolloClient,
    });
    this.accountsClient = new AccountsClient({}, accountsClientGraphQL);
    this.accountsClientPassword = new AccountsClientPassword(this.accountsClient);
    this.emails = [];
  }

  public async start() {
    await this.apolloServer.listen();
    await this.databaseTest.start();
  }

  public async stop() {
    await this.apolloServer.stop();
    await this.databaseTest.stop();
  }
}
