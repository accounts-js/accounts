import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { sendError } from '../../utils/send-error';

export const addEmail = (accountsServer: AccountsServer) => async (
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
    const { newEmail } = req.body;
    const accountsPassword = accountsServer.getServices().password as AccountsPassword;
    await accountsPassword.addEmail(userId, newEmail);
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};
