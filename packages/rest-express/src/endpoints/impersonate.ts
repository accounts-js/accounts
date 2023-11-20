import * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { ImpersonationUserIdentity } from '@accounts/types';
import { sendError } from '../utils/send-error';
import { body } from 'express-validator';
import { matchOrThrow } from '../utils/matchOrTrow';

export const impersonate = (accountsServer: AccountsServer) => [
  body('impersonated.userid').optional().isString(),
  body('impersonated.username').optional().isString(),
  body('impersonated.email').optional().isString(),
  body('accessToken').isString().notEmpty(),
  async (req: express.Request, res: express.Response) => {
    try {
      const { impersonated, accessToken } = matchOrThrow<{
        accessToken: string;
        impersonated: ImpersonationUserIdentity;
      }>(req);
      const impersonateRes = await accountsServer.impersonate(accessToken, impersonated, req.infos);
      res.json(impersonateRes);
    } catch (err) {
      sendError(res, err);
    }
  },
];
