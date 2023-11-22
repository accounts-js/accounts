import type * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';
import { param } from 'express-validator';
import { matchOrThrow } from '../utils/matchOrTrow';

export const serviceAuthenticate = (accountsServer: AccountsServer) => [
  param('service').isString().notEmpty(),
  async (req: express.Request, res: express.Response) => {
    try {
      const { service } = matchOrThrow<{ service: string }>(req);
      const loggedInUser = await accountsServer.loginWithService(service, req.body, req.infos);
      res.json(loggedInUser);
    } catch (err) {
      sendError(res, err);
    }
  },
];
