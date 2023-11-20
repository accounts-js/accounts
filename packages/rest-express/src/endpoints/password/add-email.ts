import * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { type AccountsPassword } from '@accounts/password';
import { sendError } from '../../utils/send-error';
import { body } from 'express-validator';
import { matchOrThrow } from '../../utils/matchOrTrow';

export const addEmail = (accountsServer: AccountsServer) => [
  body('newEmail').isEmail(),
  async (req: express.Request, res: express.Response) => {
    try {
      const userId: string | undefined = (req as any).userId;
      if (!userId) {
        res.status(401);
        res.json({ message: 'Unauthorized' });
        return;
      }
      const { newEmail } = matchOrThrow<{ newEmail: string }>(req);
      const accountsPassword = accountsServer.getServices().password as AccountsPassword;
      await accountsPassword.addEmail(userId, newEmail);
      res.json(null);
    } catch (err) {
      sendError(res, err);
    }
  },
];
