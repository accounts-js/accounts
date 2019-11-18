import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

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

    const { type } = req.body;
    const mfaAssociateResult = await accountsServer.mfaAssociate(
      (req as any).userId,
      type,
      req.body
    );
    res.json(mfaAssociateResult);
  } catch (err) {
    sendError(res, err);
  }
};
