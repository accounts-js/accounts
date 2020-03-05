import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { sendError } from '../../utils/send-error';

export const registerPassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { user } = req.body;
    const accountsPassword = accountsServer.getServices().password as AccountsPassword;
    const userId = await accountsPassword.createUser(user);
    res.json(accountsServer.options.ambiguousErrorMessages ? null : userId);
  } catch (err) {
    sendError(res, err);
  }
};
