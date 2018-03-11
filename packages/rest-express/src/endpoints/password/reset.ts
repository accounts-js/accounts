import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { sendError } from '../../utils/send-error';

export const resetPassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { token, newPassword } = req.body;
    const password: any = accountsServer.getServices().password;
    await password.resetPassword(token, newPassword);
    res.json({ message: 'Password changed' });
  } catch (err) {
    sendError(res, err);
  }
};

export const sendResetPasswordEmail = (
  accountsServer: AccountsServer
) => async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;
    const password: any = accountsServer.getServices().password;
    await password.sendResetPasswordEmail(email);
    res.json({ message: 'Email sent' });
  } catch (err) {
    sendError(res, err);
  }
};
