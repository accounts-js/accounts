import * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { type AccountsPassword } from '@accounts/password';
import { sendError } from '../../utils/send-error';
import { body } from 'express-validator';
import { matchOrThrow } from '../../utils/matchOrTrow';

export const changePassword = (accountsServer: AccountsServer) => [
  body('oldPassword').isString().notEmpty(),
  body('newPassword').isString().notEmpty(),
  async (req: express.Request, res: express.Response) => {
    try {
      const userId: string | undefined = (req as any).userId;
      if (!userId) {
        res.status(401);
        res.json({ message: 'Unauthorized' });
        return;
      }
      const { oldPassword, newPassword } = matchOrThrow<{
        oldPassword: string;
        newPassword: string;
      }>(req);
      const accountsPassword = accountsServer.getServices().password as AccountsPassword;
      await accountsPassword.changePassword(userId, oldPassword, newPassword);
      res.json(null);
    } catch (err) {
      sendError(res, err);
    }
  },
];
