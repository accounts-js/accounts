import type * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';
import { param } from 'express-validator';
import { matchOrThrow } from '../utils/matchOrTrow';

export const serviceVerifyAuthentication = (accountsServer: AccountsServer) => [
  param('service').isString().notEmpty(),
  async (req: express.Request, res: express.Response) => {
    try {
      const { service } = matchOrThrow<{ service: string }>(req);
      const isAuthenticated = await accountsServer.authenticateWithService(
        service,
        req.body,
        req.infos
      );
      res.json(isAuthenticated);
    } catch (err) {
      sendError(res, err);
    }
  },
];
