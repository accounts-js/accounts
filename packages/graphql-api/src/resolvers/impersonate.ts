import { AccountsServer } from '@accounts/server';
import { ImpersonationResult } from '@accounts/types';
import { IResolverContext } from '../types/graphql';

export const impersonate = (accountsServer: AccountsServer) => async (
  _: null,
  args: GQL.IImpersonateOnMutationArguments,
  ctx: IResolverContext
) => {
  const { accessToken, username } = args;
  const { ip, userAgent } = ctx;

  const impersonateRes: ImpersonationResult = await accountsServer.impersonate(
    accessToken,
    { username },
    ip,
    userAgent
  );

  // So ctx.user can be used in subsequent queries / mutations
  if (impersonateRes && impersonateRes.user && impersonateRes.tokens) {
    ctx.user = impersonateRes.user;
    ctx.authToken = impersonateRes.tokens.accessToken;
  }

  return impersonateRes;
};
