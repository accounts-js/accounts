import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../utils/send-error';

export const getUser = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    res.json((req as any).user);
  } catch (err) {
    sendError(res, err);
  }
};
