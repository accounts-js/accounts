import * as express from 'express';
import { AccountsServer, AccountsJsError } from '@accounts/server';
import { AccountsPassword, CreateUserErrors } from '@accounts/password';
import { CreateUserResult } from '@accounts/types';
import { sendError } from '../../utils/send-error';

export const registerPassword = (accountsServer: AccountsServer) => async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { user } = req.body;
    const accountsPassword = accountsServer.getServices().password as AccountsPassword;

    let userId: string;
    try {
      userId = await accountsPassword.createUser(user);
    } catch (error) {
      // If ambiguousErrorMessages is true we obfuscate the email or username already exist error
      // to prevent user enumeration during user creation
      if (
        accountsServer.options.ambiguousErrorMessages &&
        error instanceof AccountsJsError &&
        (error.code === CreateUserErrors.EmailAlreadyExists ||
          error.code === CreateUserErrors.UsernameAlreadyExists)
      ) {
        return res.json({} as CreateUserResult);
      }
      throw error;
    }

    if (!accountsServer.options.enableAutologin) {
      return res.json(
        accountsServer.options.ambiguousErrorMessages
          ? ({} as CreateUserResult)
          : ({
              userId,
            } as CreateUserResult)
      );
    }

    // When initializing AccountsServer we check that enableAutologin and ambiguousErrorMessages options
    // are not enabled at the same time

    const createdUser = await accountsServer.findUserById(userId);

    // If we are here - user must be created successfully
    // Explicitly saying this to Typescript compiler
    const loginResult = await accountsServer.loginWithUser(createdUser!, req.infos);

    return res.json({
      userId,
      loginResult,
    } as CreateUserResult);
  } catch (err) {
    sendError(res, err);
  }
};
