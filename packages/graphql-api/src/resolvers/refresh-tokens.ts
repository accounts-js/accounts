import { AccountsServer } from '@accounts/server';
import { IResolverContext } from '../types/graphql';

export const refreshAccessToken = (accountsServer: AccountsServer) => async (
  _,
  args: GQL.IRefreshTokensOnMutationArguments,
  ctx: IResolverContext
) => {
  const { accessToken, refreshToken } = args;
  const { ip, userAgent } = ctx;

  const refreshedSession = await accountsServer.refreshTokens(
    accessToken,
    refreshToken,
    ip,
    userAgent
  );

  return refreshedSession;
};
