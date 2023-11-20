import * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { type AccountsPassword } from '@accounts/password';
import { sendError } from '../../utils/send-error';
import { body } from 'express-validator';
import { matchOrThrow } from '../../utils/matchOrTrow';
import { type GeneratedSecret } from '@levminer/speakeasy';

export const twoFactorSecret =
  (accountsServer: AccountsServer) => async (req: express.Request, res: express.Response) => {
    try {
      const accountsPassword = accountsServer.getServices().password as AccountsPassword;
      const secret = accountsPassword.twoFactor.getNewAuthSecret();
      res.json({ secret });
    } catch (err) {
      sendError(res, err);
    }
  };

export const twoFactorSet = (accountsServer: AccountsServer) => [
  body('secret.base32').isString().notEmpty(),
  body('code').isString().notEmpty(),
  async (req: express.Request, res: express.Response) => {
    try {
      const userId: string | undefined = (req as any).userId;
      if (!userId) {
        res.status(401);
        res.json({ message: 'Unauthorized' });
        return;
      }
      const accountsPassword = accountsServer.getServices().password as AccountsPassword;
      const { secret, code } = matchOrThrow<{ secret: GeneratedSecret; code: string }>(req);
      await accountsPassword.twoFactor.set(userId, secret, code);
      res.json({});
    } catch (err) {
      sendError(res, err);
    }
  },
];

export const twoFactorUnset = (accountsServer: AccountsServer) => [
  body('code').isString().notEmpty(),
  async (req: express.Request, res: express.Response) => {
    try {
      const userId: string | undefined = (req as any).userId;
      if (!userId) {
        res.status(401);
        res.json({ message: 'Unauthorized' });
        return;
      }
      const { code } = matchOrThrow<{ code: string }>(req);
      const accountsPassword = accountsServer.getServices().password as AccountsPassword;
      await accountsPassword.twoFactor.unset(userId, code);
      res.json({});
    } catch (err) {
      sendError(res, err);
    }
  },
];
