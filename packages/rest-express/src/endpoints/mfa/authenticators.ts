import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

export const authenticators = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!(req as any).userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }

    const userAuthenticators = await accountsServer.findUserAuthenticators((req as any).userId);
    res.json(userAuthenticators);
  } catch (err) {
    sendError(res, err);
  }
};
