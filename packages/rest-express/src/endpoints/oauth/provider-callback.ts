import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';
import { AccountsExpressOptions } from '../../types';
import { LoginResult } from '@accounts/types';

interface RequestWithSession extends express.Request {
  session: any;
}

export const providerCallback = (
  accountsServer: AccountsServer,
  options?: AccountsExpressOptions
) => async (req: express.Request, res: express.Response) => {
  try {
    const authenticationResult = await accountsServer.loginWithService(
      'oauth',
      {
        ...(req.params || {}),
        ...(req.query || {}),
        ...(req.body || {}),
        ...((req as RequestWithSession).session || {}),
      },
      req.infos
    );

    if ('id' in authenticationResult && options && options.onOAuthSuccess) {
      options.onOAuthSuccess(req, res, authenticationResult);
    }

    if ('id' in authenticationResult && options && options.transformOAuthResponse) {
      res.json(options.transformOAuthResponse(authenticationResult));
    } else {
      res.json(authenticationResult);
    }
  } catch (err) {
    if (options && options.onOAuthError) {
      options.onOAuthError(req, res, err);
    }

    sendError(res, err);
  }
};
