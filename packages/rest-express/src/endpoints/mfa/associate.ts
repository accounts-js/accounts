import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';
import { getUserAgent } from '../../utils/get-user-agent';

export const associate = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!(req as any).userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }

    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);

    const { type } = req.body;
    const mfaAssociateResult = await accountsServer.mfa.associate(
      (req as any).userId,
      type,
      req.body,
      { userAgent, ip }
    );
    res.json(mfaAssociateResult);
  } catch (err) {
    sendError(res, err);
  }
};
