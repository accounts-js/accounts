import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';

export const refreshAccessToken = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { accessToken, refreshToken } = req.body;
    const refreshedSession = await accountsServer.refreshTokens(accessToken, refreshToken, {
      ip: req.ip,
      userAgent: req.userAgent,
    });
    res.json(refreshedSession);
  } catch (err) {
    sendError(res, err);
  }
};
