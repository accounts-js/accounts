import { AccountsServer } from '@accounts/server';
import { IResolverContext } from '../types';
import { MutationResolvers } from '../types/graphql';

export const refreshAccessToken = (
  accountsServer: AccountsServer
): MutationResolvers.RefreshTokensResolver => async (_, args, ctx: IResolverContext) => {
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
