import type * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { body } from 'express-validator';
import { matchOrThrow } from './utils/matchOrTrow';
import { sendError } from './utils/send-error';

export const userLoader = (accountsServer: AccountsServer) => [
  body('accessToken').optional().isString(),
  async (req: express.Request, res: express.Response, next: any) => {
    try {
      let accessToken =
        (req.headers?.Authorization as string | undefined) ||
        req.headers?.authorization ||
        matchOrThrow<{ accessToken?: string }>(req).accessToken ||
        undefined;
      accessToken = accessToken && accessToken.replace('Bearer ', '');
      if (accessToken) {
        try {
          (req as any).authToken = accessToken;
          const user = await accountsServer.resumeSession(accessToken);
          (req as any).user = user;
          (req as any).userId = user.id;
        } catch (e) {
          // Do nothing
        }
      }
      next();
    } catch (err) {
      sendError(res, err);
    }
  },
];
