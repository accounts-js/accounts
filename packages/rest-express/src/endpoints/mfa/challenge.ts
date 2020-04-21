import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

export const challenge = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { mfaToken, authenticatorId } = req.body;
    const mfaAssociateResult = await accountsServer.mfaChallenge(mfaToken, authenticatorId);
    res.json(mfaAssociateResult);
  } catch (err) {
    sendError(res, err);
  }
};
