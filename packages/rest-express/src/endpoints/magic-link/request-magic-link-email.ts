import * as express from 'express';
import { AccountsJsError, type AccountsServer } from '@accounts/server';
import { type AccountsMagicLink, RequestMagicLinkEmailErrors } from '@accounts/magic-link';
import { sendError } from '../../utils/send-error';
import { body } from 'express-validator';
import { matchOrThrow } from '../../utils/matchOrTrow';

export const requestMagicLinkEmail = (accountsServer: AccountsServer) => [
  body('email').isEmail(),
  async (req: express.Request, res: express.Response) => {
    try {
      const { email } = matchOrThrow<{ email: string }>(req);
      const accountsMagicLink = accountsServer.getServices().magicLink as AccountsMagicLink;
      try {
        await accountsMagicLink.requestMagicLinkEmail(email);
      } catch (error) {
        // If ambiguousErrorMessages is true,
        // to prevent user enumeration we fail silently in case there is no user attached to this email
        if (
          accountsServer.options.ambiguousErrorMessages &&
          error instanceof AccountsJsError &&
          error.code === RequestMagicLinkEmailErrors.UserNotFound
        ) {
          return res.json(null);
        }
        throw error;
      }
      res.json(null);
    } catch (err) {
      sendError(res, err);
    }
  },
];
