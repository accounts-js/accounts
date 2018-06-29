import { AccountsServer } from '@accounts/server';
import { IResolverContext } from '../types/graphql';

export const serviceAuthenticate = (accountsServer: AccountsServer) => async (
  _,
  args: GQL.IAuthenticateOnMutationArguments,
  ctx: IResolverContext
) => {
  const { serviceName, params } = args;
  const { ip, userAgent } = ctx;

  const authenticated = await accountsServer.loginWithService(serviceName, params, {
    ip,
    userAgent,
  });
  return authenticated;
};
