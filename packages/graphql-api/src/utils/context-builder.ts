import { AccountsRequest, AccountsModuleConfig } from '../modules';
import { ModuleConfig } from '@graphql-modules/core';
import { getClientIp } from 'request-ip';
// tslint:disable-next-line:no-submodule-imports
import { ModuleSessionInfo } from '@graphql-modules/core/dist/module-session-info';

export const context = (moduleName: string) => async (
  { req }: AccountsRequest,
  _: any,
  { injector }: ModuleSessionInfo
) => {
  if (!req) {
    return {
      ip: '',
      userAgent: '',
    };
  }

  const config: AccountsModuleConfig = injector.get(ModuleConfig(moduleName));
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

  let userAgent: string = (req.headers['user-agent'] as string) || '';
  if (req.headers['x-ucbrowser-ua']) {
    // special case of UC Browser
    userAgent = req.headers['x-ucbrowser-ua'] as string;
  }

  return {
    authToken,
    userAgent,
    ip: getClientIp(req),
    user,
    userId: user && user.id,
  };
};
