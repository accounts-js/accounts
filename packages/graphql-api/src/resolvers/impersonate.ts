import { AccountsServer } from '@accounts/server';
import { IResolverContext } from '../types';
import { MutationResolvers } from '../types/graphql';

export const impersonate = (
  accountsServer: AccountsServer
): MutationResolvers.ImpersonateResolver => async (_, args, ctx: IResolverContext) => {
  const { accessToken, username } = args;
  const { ip, userAgent } = ctx;

  const impersonateRes = await accountsServer.impersonate(accessToken, { username }, ip, userAgent);

  // So ctx.user can be used in subsequent queries / mutations
  if (impersonateRes && impersonateRes.user && impersonateRes.tokens) {
    ctx.user = impersonateRes.user;
    ctx.authToken = impersonateRes.tokens.accessToken;
  }

  return impersonateRes;
};
