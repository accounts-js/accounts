import AccountsServer from '@accounts/server';
import { IncomingMessage } from 'http';
import { getClientIp } from 'request-ip';

interface AccountsContextOptions {
  accountsServer: AccountsServer;
  headerName?: string;
  excludeAddUserInContext?: boolean;
}

export const context = async (
  {
    req,
  }: {
    req: IncomingMessage;
  },
  options: AccountsContextOptions
) => {
  if (!req) {
    return {
      ip: '',
      userAgent: '',
      infos: {
        ip: '',
        userAgent: '',
      },
    };
  }

  const headerName = options.headerName || 'Authorization';
  let authToken = (req.headers[headerName] || req.headers[headerName.toLowerCase()]) as string;
  authToken = authToken && authToken.replace('Bearer ', '');
  let user;

  if (authToken && !options.excludeAddUserInContext) {
    try {
      user = await options.accountsServer.resumeSession(authToken);
    } catch (error) {
      // Empty catch
    }
  }

  const ip = getClientIp(req);
  let userAgent: string = (req.headers['user-agent'] as string) || '';
  if (req.headers['x-ucbrowser-ua']) {
    // special case of UC Browser
    userAgent = req.headers['x-ucbrowser-ua'] as string;
  }

  return {
    authToken,
    user,
    userId: user && user.id,
    userAgent,
    ip,
    infos: {
      userAgent,
      ip,
    },
  };
};
