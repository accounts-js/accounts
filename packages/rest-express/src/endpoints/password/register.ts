import type * as express from 'express';
import { type AccountsServer, AccountsJsError } from '@accounts/server';
import { type AccountsPassword, CreateUserErrors } from '@accounts/password';
import { type CreateUserResult, type CreateUserServicePassword } from '@accounts/types';
import { sendError } from '../../utils/send-error';
import { body } from 'express-validator';
import { matchOrThrow } from '../../utils/matchOrTrow';

export const registerPassword = (accountsServer: AccountsServer) => [
  body('user').isObject().notEmpty(),
  body('user.username').optional().isString().notEmpty(),
  body('user.email').optional().isEmail(),
  body('user.password').isString().notEmpty(),
  async (req: express.Request, res: express.Response) => {
    try {
      const { user } = matchOrThrow<{ user: CreateUserServicePassword }>(req);
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
          accountsServer.options.ambiguousErrorMessages &&
            accountsPassword.options.requireEmailVerification
            ? ({} as CreateUserResult)
            : ({
                userId,
              } as CreateUserResult)
        );
      }

      // When initializing AccountsPassword we check that enableAutologin and requireEmailVerification options
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
  },
];
