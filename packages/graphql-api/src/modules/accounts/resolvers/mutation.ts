import { AccountsServer } from '@accounts/server';
import { ctxAsyncLocalStorage } from '@accounts/types';
import { MutationResolvers } from '../../../models';

export const Mutation: MutationResolvers = {
  authenticate: async (_, args, ctx) => {
    const { serviceName, params } = args;
    const { injector, infos } = ctx;

    return ctxAsyncLocalStorage.run(ctx, async () => {
      const authenticated = await injector
        .get(AccountsServer)
        .loginWithService(serviceName, params, infos);
      return authenticated;
    });
  },
  verifyAuthentication: async (_, args, ctx) => {
    const { serviceName, params } = args;
    const { injector, infos } = ctx;

    return ctxAsyncLocalStorage.run(ctx, async () => {
      const authenticated = await injector
        .get(AccountsServer)
        .authenticateWithService(serviceName, params, infos);
      return authenticated;
    });
  },
  impersonate: async (_, args, ctx) => {
    const { accessToken, impersonated } = args;
    const { injector, infos } = ctx;

    return ctxAsyncLocalStorage.run(ctx, async () => {
      const impersonateRes = await injector.get(AccountsServer).impersonate(
        accessToken,
        {
          userId: impersonated.userId!,
          username: impersonated.username!,
          email: impersonated.email!,
        },
        infos
      );

      // So ctx.user can be used in subsequent queries / mutations
      if (impersonateRes && impersonateRes.user && impersonateRes.tokens) {
        ctx.user = impersonateRes.user;
        ctx.authToken = impersonateRes.tokens.accessToken;
      }

      return impersonateRes;
    });
  },
  logout: async (_, __, context) => {
    const { authToken, injector } = context;

    return ctxAsyncLocalStorage.run(context, async () => {
      if (authToken) {
        await injector.get(AccountsServer).logout(authToken);
      }

      return null;
    });
  },
  refreshTokens: async (_, args, ctx) => {
    const { accessToken, refreshToken } = args;
    const { injector, infos } = ctx;

    return ctxAsyncLocalStorage.run(ctx, async () => {
      const refreshedSession = await injector
        .get(AccountsServer)
        .refreshTokens(accessToken, refreshToken, infos);

      return refreshedSession;
    });
  },
};
