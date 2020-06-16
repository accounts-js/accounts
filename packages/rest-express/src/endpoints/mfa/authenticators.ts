import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

export const authenticators = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }

    const userAuthenticators = await accountsServer.mfa.findUserAuthenticators(userId);
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

    const userAuthenticators = await accountsServer.mfa.findUserAuthenticatorsByMfaToken(mfaToken);
    res.json(userAuthenticators);
  } catch (err) {
    sendError(res, err);
  }
};
