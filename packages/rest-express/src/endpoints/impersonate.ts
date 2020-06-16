import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { ImpersonationUserIdentity } from '@accounts/types';
import { getUserAgent } from '../utils/get-user-agent';
import { sendError } from '../utils/send-error';

export const impersonate = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      impersonated,
      accessToken,
    }: {
      accessToken: string;
      impersonated: ImpersonationUserIdentity;
    } = req.body;
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);
    const impersonateRes = await accountsServer.impersonate(accessToken, impersonated, {
      ip,
      userAgent,
    });
    res.json(impersonateRes);
  } catch (err) {
    sendError(res, err);
  }
};
