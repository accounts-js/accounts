import * as express from 'express';
import { AccountsJsError, type AccountsServer } from '@accounts/server';
import { type AccountsPassword, SendResetPasswordEmailErrors } from '@accounts/password';
import { sendError } from '../../utils/send-error';

export const resetPassword =
  (accountsServer: AccountsServer) => async (req: express.Request, res: express.Response) => {
    try {
      const { token, newPassword } = req.body;
      const accountsPassword = accountsServer.getServices().password as AccountsPassword;
      const loginResult = await accountsPassword.resetPassword(token, newPassword, req.infos);
      res.json(loginResult);
    } catch (err) {
      sendError(res, err);
    }
  };

export const sendResetPasswordEmail =
  (accountsServer: AccountsServer) => async (req: express.Request, res: express.Response) => {
    try {
      const { email } = req.body;
      const accountsPassword = accountsServer.getServices().password as AccountsPassword;

      try {
        await accountsPassword.sendResetPasswordEmail(email);
      } catch (error) {
        // If ambiguousErrorMessages is true,
        // to prevent user enumeration we fail silently in case there is no user attached to this email
        if (
          accountsServer.options.ambiguousErrorMessages &&
          error instanceof AccountsJsError &&
          error.code === SendResetPasswordEmailErrors.UserNotFound
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
