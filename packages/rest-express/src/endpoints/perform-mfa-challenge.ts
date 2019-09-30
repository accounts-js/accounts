import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';

export const performMfaChallenge = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { challenge, mfaToken, params } = req.body;
    const loginToken = await accountsServer.performMfaChallenge(challenge, mfaToken, params);
    res.json(loginToken);
  } catch (err) {
    sendError(res, err);
  }
};
