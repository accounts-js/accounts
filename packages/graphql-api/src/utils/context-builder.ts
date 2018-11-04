import { getClientIp } from 'request-ip';
import { IncomingMessage } from 'http';
import { AccountsServer } from '@accounts/server';

export const getUA = (req: IncomingMessage) => {
  let userAgent: string = (req.headers['user-agent'] as string) || '';
  if (req.headers['x-ucbrowser-ua']) {
    // special case of UC Browser
    userAgent = req.headers['x-ucbrowser-ua'] as string;
  }
  return userAgent;
};

interface AccountsContextOptions {
  accountsServer: AccountsServer;
  headerName?: string;
}

export const accountsContext = async (
  request: IncomingMessage,
  options: AccountsContextOptions
) => {
  const headerName = options.headerName || 'accounts-access-token';
  const authToken = request.headers[headerName] || request.headers[headerName.toLowerCase()];
  let user;

  if (authToken) {
    try {
      user = await options.accountsServer.resumeSession(authToken as string);
    } catch (error) {
      // Empty catch
    }
  }

  return {
    authToken,
    userAgent: getUA(request),
    ip: getClientIp(request),
    user,
    userId: user && user.id,
  };
};
