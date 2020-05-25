import { MutationResolvers } from '../../../models';
import { ModuleContext } from '@graphql-modules/core';
import { AccountsModuleContext } from '..';
import { AccountsServer } from '@accounts/server';

export const Mutation: MutationResolvers<ModuleContext<AccountsModuleContext>> = {
  authenticate: async (_, args, ctx) => {
    const { serviceName, params } = args;
    const { injector, infos } = ctx;

    const authenticated = await injector
      .get(AccountsServer)
      .loginWithService(serviceName, params, infos);
    return authenticated;
  },
  verifyAuthentication: async (_, args, ctx) => {
    const { serviceName, params } = args;
    const { injector, infos } = ctx;

    const authenticated = await injector
      .get(AccountsServer)
      .authenticateWithService(serviceName, params, infos);
    return authenticated;
  },
  impersonate: async (_, args, ctx) => {
    const { accessToken, username } = args;
    const { injector, infos } = ctx;

    const impersonateRes = await injector
      .get(AccountsServer)
      .impersonate(accessToken, { username }, infos);

    // So ctx.user can be used in subsequent queries / mutations
    if (impersonateRes && impersonateRes.user && impersonateRes.tokens) {
      ctx.user = impersonateRes.user;
      ctx.authToken = impersonateRes.tokens.accessToken;
    }

    return impersonateRes;
  },
  logout: async (_, __, context) => {
    const { authToken, injector } = context;

    if (authToken) {
      await injector.get(AccountsServer).logout(authToken);
    }

    return null;
  },
  refreshTokens: async (_, args, ctx) => {
    const { accessToken, refreshToken } = args;
    const { injector, infos } = ctx;

    const refreshedSession = await injector
      .get(AccountsServer)
      .refreshTokens(accessToken, refreshToken, infos);

    return refreshedSession;
  },
};
