import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

export const addEmail = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!(req as any).userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }
    const { newEmail } = req.body;
    const password: any = accountsServer.getServices().password;
    await password.addEmail((req as any).userId, newEmail);
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};
