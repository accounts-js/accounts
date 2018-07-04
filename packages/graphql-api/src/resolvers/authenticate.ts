import { AccountsServer } from '@accounts/server';
import { IResolverContext } from '../types';
import { MutationResolvers } from '../types/graphql';

export const serviceAuthenticate = (
  accountsServer: AccountsServer
): MutationResolvers.AuthenticateResolver => async (_, args, ctx: IResolverContext) => {
  const { serviceName, params } = args;
  const { ip, userAgent } = ctx;

  const authenticated = await accountsServer.loginWithService(serviceName, params, {
    ip,
    userAgent,
  });
  return authenticated;
};
