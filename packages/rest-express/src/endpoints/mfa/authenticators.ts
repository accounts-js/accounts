import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { AccountsMfa } from '@accounts/mfa';
import { sendError } from '../../utils/send-error';

export const authenticators = (accountsServer: AccountsServer) => async (
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

    const accountsMfa = accountsServer.getService('mfa') as AccountsMfa;
    const userAuthenticators = await accountsMfa.findUserAuthenticators(userId);
    res.json(userAuthenticators);
  } catch (err) {
    sendError(res, err);
  }
};

export const authenticatorsByMfaToken = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { mfaToken } = req.query as { mfaToken: string };

    const accountsMfa = accountsServer.getService('mfa') as AccountsMfa;
    const userAuthenticators = await accountsMfa.findUserAuthenticatorsByMfaToken(mfaToken);
    res.json(userAuthenticators);
  } catch (err) {
    sendError(res, err);
  }
};
