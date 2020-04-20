import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

/**
 * If user is authenticated, this route will return all the authenticators of the user.
 * If user is not authenticated, he needs to provide a valid mfa token in order to
 * get a list of the authenticators that can be used to resolve the mfa challenge.
 */
export const authenticators = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = (req as any).userId;
    const { mfaToken } = req.query;
    if (!mfaToken && !userId) {
      res.status(401);
      res.json({ message: 'Unauthorized' });
      return;
    }

    const userAuthenticators = mfaToken
      ? await accountsServer.findUserAuthenticatorsByMfaToken(mfaToken)
      : await accountsServer.findUserAuthenticators(userId);
    res.json(userAuthenticators);
  } catch (err) {
    sendError(res, err);
  }
};
