import * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';

export const serviceAuthenticate =
  (accountsServer: AccountsServer) => async (req: express.Request, res: express.Response) => {
    try {
      const serviceName = req.params.service;
      const loggedInUser = await accountsServer.loginWithService(serviceName, req.body, req.infos);
      res.json(loggedInUser);
    } catch (err) {
      sendError(res, err);
    }
  };
