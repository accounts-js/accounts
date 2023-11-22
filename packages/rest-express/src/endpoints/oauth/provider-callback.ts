import type * as express from 'express';
import { type AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';
import { type AccountsExpressOptions } from '../../types';

interface RequestWithSession extends express.Request {
  session: any;
}

export const providerCallback =
  (accountsServer: AccountsServer, options?: AccountsExpressOptions) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const loggedInUser = await accountsServer.loginWithService(
        'oauth',
        {
          ...(req.params || {}),
          ...(req.query || {}),
          ...(req.body || {}),
          ...((req as RequestWithSession).session || {}),
        },
        req.infos
      );

      if (options && options.onOAuthSuccess) {
        options.onOAuthSuccess(req, res, loggedInUser);
      }

      if (options && options.transformOAuthResponse) {
        res.json(options.transformOAuthResponse(loggedInUser));
      } else {
        res.json(loggedInUser);
      }
    } catch (err) {
      if (options && options.onOAuthError) {
        options.onOAuthError(req, res, err);
      }

      sendError(res, err);
    }
  };
