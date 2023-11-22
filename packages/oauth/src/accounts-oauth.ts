import {
  type User,
  type DatabaseInterface,
  type AuthenticationService,
  type DatabaseInterfaceUser,
} from '@accounts/types';
import {
  AccountsServer,
  /*DatabaseInterfaceSessionsToken,*/ DatabaseInterfaceUserToken,
  ServerHooks,
} from '@accounts/server';
import { type OAuthProviders } from './types/oauth-providers';
import { type OAuthUser } from './types/oauth-user';
import { ExecutionContext, Inject, Injectable } from 'graphql-modules';
import { OAuthProvidersToken } from './types/OAuthProviders.symbol';

const getRegistrationPayloadDefault = async (oauthUser: OAuthUser) => {
  return {
    email: oauthUser.email,
  };
};

@Injectable({
  global: true,
})
export class AccountsOauth<CustomUser extends User = User>
  implements AuthenticationService<CustomUser>
{
  @ExecutionContext() public context!: ExecutionContext;
  public server!: AccountsServer;
  public serviceName = 'oauth';
  private db!: DatabaseInterfaceUser<CustomUser>;
  // private dbSessions!: DatabaseInterfaceSessions;

  constructor(
    @Inject(OAuthProvidersToken) public oauthProviders: OAuthProviders,
    @Inject(DatabaseInterfaceUserToken)
    db?: DatabaseInterface<CustomUser> | DatabaseInterfaceUser<CustomUser>,
    // @Inject(DatabaseInterfaceSessionsToken) dbSessions?: DatabaseInterfaceSessions,
    @Inject(AccountsServer) server?: AccountsServer
  ) {
    if (db) {
      this.db = db;
      // this.dbSessions = dbSessions ?? (db as DatabaseInterfaceSessions);
    }

    if (server) {
      this.server = server;
    }
  }

  private getOAuthProvider(providerName: string) {
    const instanceOrCtor = this.oauthProviders[providerName];
    // If it's a constructor we use dependency injection (GraphQL), otherwise we already have an instance (REST)
    const provider =
      typeof instanceOrCtor === 'function'
        ? this.context.injector.get(instanceOrCtor)
        : instanceOrCtor;
    if (!provider) {
      throw new Error(`No OAuth provider with the name ${providerName} was registered.`);
    }
    return provider;
  }

  public getOAuthProviders(): OAuthProviders {
    return this.oauthProviders;
  }

  public setUserStore(store: DatabaseInterfaceUser<CustomUser>) {
    this.db = store;
  }

  public setSessionsStore() {
    // Empty
  }

  public async authenticate(params: any): Promise<CustomUser | null> {
    if (!params.provider) {
      throw new Error('Invalid provider');
    }

    const userProvider = this.getOAuthProvider(params.provider);

    if (typeof userProvider.authenticate !== 'function') {
      throw new Error('Invalid provider');
    }

    const oauthUser = await userProvider.authenticate(params);
    let user = await this.db.findUserByServiceId(params.provider, oauthUser.id);

    if (!user && oauthUser.email) {
      user = await this.db.findUserByEmail(oauthUser.email);
    }

    if (!user) {
      try {
        const userData = await (
          userProvider.getRegistrationPayload || getRegistrationPayloadDefault
        )(oauthUser);

        const userId = await this.db.createUser(userData);

        user = await this.db.findUserById(userId);

        if (user == null) {
          throw new Error(`Cannot find user ${userId}`);
        }

        if (this.server) {
          await this.server.getHooks().emit(ServerHooks.CreateUserSuccess, user);
        }
      } catch (e) {
        if (this.server) {
          await this.server.getHooks().emit(ServerHooks.CreateUserError, user);
        }

        throw e;
      }
    }

    await this.db.setService(user.id, params.provider, oauthUser);

    return user;
  }

  public async unlink(userId: string, provider: string) {
    if (!provider) {
      throw new Error('Invalid provider');
    }

    // Check whether the service has been provided, throws if not
    this.getOAuthProvider(provider);

    await this.db.setService(userId, provider, null as any);
  }
}
