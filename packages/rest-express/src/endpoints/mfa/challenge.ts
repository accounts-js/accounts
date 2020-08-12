import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { AccountsMfa } from '@accounts/mfa';
import { sendError } from '../../utils/send-error';

export const challenge = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { mfaToken, authenticatorId } = req.body;
    const accountsMfa = accountsServer.getService('mfa') as AccountsMfa;
    const challengeResult = await accountsMfa.challenge(mfaToken, authenticatorId, req.infos);
    res.json(challengeResult);
  } catch (err) {
    sendError(res, err);
  }
};
