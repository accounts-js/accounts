import * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { ImpersonationUserIdentity } from '@accounts/types';
import { sendError } from '../utils/send-error';

export const impersonate =
  (accountsServer: AccountsServer) => async (req: express.Request, res: express.Response) => {
    try {
      const {
        impersonated,
        accessToken,
      }: {
        accessToken: string;
        impersonated: ImpersonationUserIdentity;
      } = req.body;
      const impersonateRes = await accountsServer.impersonate(accessToken, impersonated, req.infos);
      res.json(impersonateRes);
    } catch (err) {
      sendError(res, err);
    }
  };
