import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

export const associate = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { type } = req.body;
    const mfaAssociateResult = await accountsServer.mfaAssociate(type);
    res.json(mfaAssociateResult);
  } catch (err) {
    sendError(res, err);
  }
};
