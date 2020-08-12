import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { AccountsMfa } from '@accounts/mfa';
import { sendError } from '../../utils/send-error';

export const associate = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId: string | undefined = (req as any).userId;
    if (!userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }

    const { type, params } = req.body;
    const accountsMfa = accountsServer.getService('mfa') as AccountsMfa;
    const mfaAssociateResult = await accountsMfa.associate(userId, type, params, req.infos);
    res.json(mfaAssociateResult);
  } catch (err) {
    sendError(res, err);
  }
};

export const associateByMfaToken = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { mfaToken, type, params } = req.body;
    const accountsMfa = accountsServer.getService('mfa') as AccountsMfa;
    const mfaAssociateResult = await accountsMfa.associateByMfaToken(
      mfaToken,
      type,
      params,
      req.infos
    );
    res.json(mfaAssociateResult);
  } catch (err) {
    sendError(res, err);
  }
};
