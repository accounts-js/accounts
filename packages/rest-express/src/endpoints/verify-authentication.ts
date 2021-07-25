import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';

export const serviceVerifyAuthentication =
  (accountsServer: AccountsServer) => async (req: express.Request, res: express.Response) => {
    try {
      const serviceName = req.params.service;
      const isAuthenticated = await accountsServer.authenticateWithService(
        serviceName,
        req.body,
        req.infos
      );
      res.json(isAuthenticated);
    } catch (err) {
      sendError(res, err);
    }
  };
