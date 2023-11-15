import * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { type AccountsPassword } from '@accounts/password';
import { sendError } from '../../utils/send-error';

export const twoFactorSecret =
  (accountsServer: AccountsServer) => async (req: express.Request, res: express.Response) => {
    try {
      const accountsPassword = accountsServer.getServices().password as AccountsPassword;
      const secret = await accountsPassword.twoFactor.getNewAuthSecret();
      res.json({ secret });
    } catch (err) {
      sendError(res, err);
    }
  };

export const twoFactorSet =
  (accountsServer: AccountsServer) => async (req: express.Request, res: express.Response) => {
    try {
      const userId: string | undefined = (req as any).userId;
      if (!userId) {
        res.status(401);
        res.json({ message: 'Unauthorized' });
        return;
      }
      const accountsPassword = accountsServer.getServices().password as AccountsPassword;
      await accountsPassword.twoFactor.set(userId, req.body.secret, req.body.code);
      res.json({});
    } catch (err) {
      sendError(res, err);
    }
  };

export const twoFactorUnset =
  (accountsServer: AccountsServer) => async (req: express.Request, res: express.Response) => {
    try {
      const userId: string | undefined = (req as any).userId;
      if (!userId) {
        res.status(401);
        res.json({ message: 'Unauthorized' });
        return;
      }
      const { code } = req.body;
      const accountsPassword = accountsServer.getServices().password as AccountsPassword;
      await accountsPassword.twoFactor.unset(userId, code);
      res.json({});
    } catch (err) {
      sendError(res, err);
    }
  };
