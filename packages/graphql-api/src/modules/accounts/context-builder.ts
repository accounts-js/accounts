import { getClientIp } from 'request-ip';
import { IncomingMessage } from 'http';
import { Injector, ModuleConfig, ModuleContext } from '@graphql-modules/core';
import { IAccountsModuleContext, IAccountsModuleConfig, AccountsModule, IAccountsRequest } from '.';

export const getUA = (req: IncomingMessage) => {
  let userAgent: string = (req.headers['user-agent'] as string) || '';
  if (req.headers['x-ucbrowser-ua']) {
    // special case of UC Browser
    userAgent = req.headers['x-ucbrowser-ua'] as string;
  }
  return userAgent;
};

export const contextBuilder = async (
  { req }: IAccountsRequest,
  currentContext: ModuleContext<IAccountsModuleContext>,
  injector: Injector
) => {
  const config: IAccountsModuleConfig = injector.get(ModuleConfig(AccountsModule));
  const headerName = config.headerName || 'accounts-access-token';
  const authToken = (req.headers[headerName] || req.headers[headerName.toLowerCase()]) as string;
  let user;

  if (authToken) {
    try {
      user = await config.accountsServer.resumeSession(authToken);
    } catch (error) {
      // Empty catch
    }
  }

  return {
    authToken,
    userAgent: getUA(req),
    ip: getClientIp(req),
    user,
    userId: user && user.id,
  };
};
