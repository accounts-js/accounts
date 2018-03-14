import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';

export const logout = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { accessToken } = req.body;
    await accountsServer.logout(accessToken);
    res.json({ message: 'Logged out' });
  } catch (err) {
    sendError(res, err);
  }
};
