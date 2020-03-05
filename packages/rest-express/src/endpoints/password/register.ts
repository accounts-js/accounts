import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { sendError } from '../../utils/send-error';
import { CreateUserResult } from '@accounts/types';
import { getUserAgent } from '../../utils/get-user-agent';
import * as requestIp from 'request-ip';

export const registerPassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const accountsPassword = accountsServer.getServices().password as AccountsPassword;
    const userId = await accountsPassword.createUser(req.body.user);

    if (!accountsServer.options.enableAutologin) {
      return res.json({
        userId: accountsServer.options.ambiguousErrorMessages ? null : userId,
      } as CreateUserResult);
    }

    // When initializing AccountsServer we check that enableAutologin and ambiguousErrorMessages options
    // are not enabled at the same time

    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req);

    const createdUser = await accountsServer.findUserById(userId);

    // If we are here - user must be created successfully
    // Explicitly saying this to Typescript compiler
    const loginResult = await accountsServer.loginWithUser(createdUser!, {
      ip,
      userAgent,
    });

    return res.json({
      userId,
      loginResult,
    } as CreateUserResult);
  } catch (err) {
    sendError(res, err);
  }
};
