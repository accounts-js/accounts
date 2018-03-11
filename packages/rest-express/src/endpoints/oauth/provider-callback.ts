import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { getUserAgent } from '../../utils/get-user-agent';
import { sendError } from '../../utils/send-error';

interface RequestWithSession extends express.Request {
  session: { [key: string]: any };
}

export const providerCallback = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);
    const loggedInUser = await accountsServer.loginWithService(
      'oauth',
      {
        ...(req.params || {}),
        ...(req.query || {}),
        ...(req.body || {}),
        ...((req as RequestWithSession).session || {}),
      },
      { ip, userAgent }
    );
    res.json(loggedInUser);
  } catch (err) {
    sendError(res, err);
  }
};
