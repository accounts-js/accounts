import * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';

export const logout =
  (accountsServer: AccountsServer) => async (req: express.Request, res: express.Response) => {
    try {
      const { authToken } = req as express.Request & { authToken: string };
      await accountsServer.logout(authToken);
      res.json(null);
    } catch (err) {
      sendError(res, err);
    }
  };
