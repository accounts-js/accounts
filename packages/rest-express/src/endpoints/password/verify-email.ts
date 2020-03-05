import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { sendError } from '../../utils/send-error';

export const verifyEmail = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { token } = req.body;
    const accountsPassword = accountsServer.getServices().password as AccountsPassword;
    await accountsPassword.verifyEmail(token);
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};

export const sendVerificationEmail = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;
    const accountsPassword = accountsServer.getServices().password as AccountsPassword;
    await accountsPassword.sendVerificationEmail(email);
    res.json(null);
  } catch (err) {
    sendError(res, err);
  }
};
