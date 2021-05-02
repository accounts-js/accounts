import * as express from 'express';
import { AccountsJsError, AccountsServer } from '@accounts/server';
import { AccountsToken, RequestLoginTokenErrors } from '@accounts/token';
import { sendError } from '../../utils/send-error';

export const requestLoginToken = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;
    const accountsToken = accountsServer.getServices().token as AccountsToken;
    try {
      await accountsToken.requestLoginToken(email);
    } catch (error) {
      // If ambiguousErrorMessages is true,
      // to prevent user enumeration we fail silently in case there is no user attached to this email
      if (
        accountsServer.options.ambiguousErrorMessages &&
        error instanceof AccountsJsError &&
        error.code === RequestLoginTokenErrors.UserNotFound
      ) {
        return res.json(null);
      }
      throw error;
    }
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};
