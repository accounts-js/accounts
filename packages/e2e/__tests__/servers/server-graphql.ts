import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { context, createAccountsCoreModule } from '@accounts/module-core';
import { createAccountsPasswordModule } from '@accounts/module-password';
import { Application, Module, createApplication } from 'graphql-modules';
import { AccountsGraphQLClient } from '@accounts/graphql-client';
import { AccountsPassword } from '@accounts/password';
import { AuthenticationServicesToken, DatabaseInterfaceUserToken } from '@accounts/server';
import { DatabaseInterface, User } from '@accounts/types';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import fetch from 'node-fetch';

import { ServerTestInterface } from '.';
import { DatabaseTestInterface } from '../databases';
import { DatabaseTest } from '../databases/mongo';

// Server
// Client
(global as any).fetch = fetch;

const convertUrlToToken = (url: string): string => {
  const split = url.split('/');
  return split[split.length - 1];
};

export class ServerGraphqlTest implements ServerTestInterface {
  get accountsDatabase() {
    return this.accountsApp.injector.get(DatabaseInterfaceUserToken) as DatabaseInterface;
  }
  public port = 5000;

  public accountsDatabaseModule: Module;
  public accountsApp: Application;

  public accountsClient: AccountsClient;
  public accountsClientPassword: AccountsClientPassword;

  public emails: any[];

  private apolloServer: ApolloServer;
  private databaseTest: DatabaseTestInterface;

  constructor() {
    this.databaseTest = new DatabaseTest();
    this.accountsDatabaseModule = this.databaseTest.databaseModule;
    this.accountsApp = createApplication({
      modules: [
        createAccountsCoreModule({
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
            passwordChanged: {
              subject: () => 'Your password has been changed',
              text: () => `Your account password has been successfully changed`,
              html: () => `Your account password has been successfully changed.`,
            },
            magicLink: {
              subject: () => 'Your magic link',
              text: (user: User, url: string) => convertUrlToToken(url),
            },
          },
          sendMail: async (mail) => {
            this.emails.push(mail);
          },
        }),
        createAccountsPasswordModule(),
        this.accountsDatabaseModule,
      ],
      providers: [
        {
          provide: AuthenticationServicesToken,
          useValue: { password: AccountsPassword },
          global: true,
        },
      ],
    });

    this.apolloServer = new ApolloServer({
      schema: this.accountsApp.createSchemaForApollo(),
    });

    const apolloClient = new ApolloClient({
      uri: `http://localhost:${this.port}`,
      cache: new InMemoryCache(),
    });

    const accountsClientGraphQL = new AccountsGraphQLClient({
      graphQLClient: apolloClient,
    });
    this.accountsClient = new AccountsClient({}, accountsClientGraphQL);
    this.accountsClientPassword = new AccountsClientPassword(this.accountsClient);
    this.emails = [];
  }

  public async start() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await startStandaloneServer(this.apolloServer, {
      listen: { port: this.port },
      context: (ctx) => context(ctx, { app: this.accountsApp }),
    });
    await this.databaseTest.start();
  }

  public async stop() {
    await this.apolloServer.stop();
    await this.databaseTest.stop();
  }
}
