import * as express from 'express';
import { get, isEmpty } from 'lodash';
import { AccountsServer } from '@accounts/server';

export const userLoader = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  const accessToken =
    get(req.headers, 'accounts-access-token') ||
    get(req.body, 'accessToken', undefined);
  if (!isEmpty(accessToken)) {
    try {
      const user = await accountsServer.resumeSession(accessToken);
      (req as any).user = user;
      (req as any).userId = user.id;
    } catch (e) {
      // Do nothing
    }
  }
  next();
};
