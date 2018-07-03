import { getClientIp } from 'request-ip';
import { IncomingMessage } from 'http';

export const getUA = (req: IncomingMessage) => {
  let userAgent: string = (req.headers['user-agent'] as string) || '';
  if (req.headers['x-ucbrowser-ua']) {
    // special case of UC Browser
    userAgent = req.headers['x-ucbrowser-ua'] as string;
  }
  return userAgent;
};

export const JSAccountsContext = (request: IncomingMessage, headerName = 'Authorization') => ({
  authToken: request.headers[headerName] || request.headers[headerName.toLowerCase()],
  userAgent: getUA(request),
  ip: getClientIp(request),
});
