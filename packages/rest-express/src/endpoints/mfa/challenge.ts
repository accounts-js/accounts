import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { AccountsMfa } from '@accounts/mfa';
import { sendError } from '../../utils/send-error';
import { getUserAgent } from '../../utils/get-user-agent';

export const challenge = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);

    const { mfaToken, authenticatorId } = req.body;
    const accountsMfa = accountsServer.getService('mfa') as AccountsMfa;
    const challengeResult = await accountsMfa.challenge(mfaToken, authenticatorId, {
      userAgent,
      ip,
    });
    res.json(challengeResult);
  } catch (err) {
    sendError(res, err);
  }
};
