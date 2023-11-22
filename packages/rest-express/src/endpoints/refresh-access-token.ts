import type * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';
import { body } from 'express-validator';
import { matchOrThrow } from '../utils/matchOrTrow';

export const refreshAccessToken = (accountsServer: AccountsServer) => [
  body('accessToken').isString().notEmpty(),
  body('refreshToken').isString().notEmpty(),
  async (req: express.Request, res: express.Response) => {
    try {
      const { accessToken, refreshToken } = matchOrThrow<{
        accessToken: string;
        refreshToken: string;
      }>(req);
      const refreshedSession = await accountsServer.refreshTokens(
        accessToken,
        refreshToken,
        req.infos
      );
      res.json(refreshedSession);
    } catch (err) {
      sendError(res, err);
    }
  },
];
