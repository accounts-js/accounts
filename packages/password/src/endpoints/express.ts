import { type Injector } from 'graphql-modules';
import type { Request, Response, NextFunction } from 'express';
import AccountsPassword from '../accounts-password';
import { body, matchedData, param, validationResult } from 'express-validator';
import { getClientIp } from 'request-ip';

function matchOrThrow<T extends Record<string, any> = Record<string, any>>(
  ...args: Parameters<typeof matchedData>
): T {
  if (!validationResult(args[0]).isEmpty()) {
    throw new Error('Validation error');
  }
  return matchedData(...args) as T;
}

const getUserAgent = (req: Request) => {
  let userAgent: string = (req.headers['user-agent'] as string) || '';
  if (req.headers['x-ucbrowser-ua']) {
    // special case of UC Browser
    userAgent = req.headers['x-ucbrowser-ua'] as string;
  }
  return userAgent;
};

function getHtml(title: string, body: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
      </head>
      <body>
        ${body}
      </body>
    </html>
  `;
}

export const infosMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  req.infos = {
    userAgent: getUserAgent(req),
    ip: getClientIp(req) ?? req.ip,
  };
  next();
};

export const verifyEmail = (accountsPasswordOrInjector: Injector | AccountsPassword) => [
  param('token').isString().notEmpty(),
  async (req: Request, res: Response) => {
    try {
      const { token } = matchOrThrow<{ token: string }>(req);
      const accountsPassword =
        accountsPasswordOrInjector instanceof AccountsPassword
          ? accountsPasswordOrInjector
          : accountsPasswordOrInjector.get(AccountsPassword);
      await accountsPassword.verifyEmail(token);
      res.send(
        getHtml(
          'Email successfully verified',
          `
    <h3>The email address has been successfully verified.</h3>
  `
        )
      );
    } catch (err: any) {
      res.send(
        //codeql[js/xss-through-exception]
        getHtml(
          'Email verification error',
          `
    <h3>The email address couldn't be verified: ${err.message ?? 'unknown error'}</h3>
  `
        )
      );
    }
  },
];

export const resetPassword = (accountsPasswordOrInjector: Injector | AccountsPassword) => [
  body('token').isString().notEmpty(),
  body('newPassword').isString().notEmpty(),
  async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = matchOrThrow<{ token: string; newPassword: string }>(req);
      const accountsPassword =
        accountsPasswordOrInjector instanceof AccountsPassword
          ? accountsPasswordOrInjector
          : accountsPasswordOrInjector.get(AccountsPassword);
      await accountsPassword.resetPassword(token, newPassword, req.infos);
      res.send(
        getHtml(
          'Password successfully changed',
          `
    <h3>The password has been successfully changed.</h3>
  `
        )
      );
    } catch (err: any) {
      //codeql[js/xss-through-exception]
      res.send(
        getHtml(
          'Password reset error',
          `
    <h3>The password couldn't be changed: ${err.message ?? 'unknown error'}</h3>
  `
        )
      );
    }
  },
];

export const resetPasswordForm = [
  param('token').isString().notEmpty().escape(),
  (req: Request, res: Response) => {
    try {
      const { token } = matchOrThrow<{ token: string }>(req);
      res.send(
        getHtml(
          'Reset password',
          `
          <div class="container">
          <h1>Reset your password</h1>
          <form action="/resetPassword" method="POST">
            <input type="hidden" name="token" value=${token} />
            <div class="form-group">
              <label for="newPassword">New password</label>
              <input type="text" class="form-control" id="newPassword" value="" placeholder="Enter your new password" name="newPassword">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        `
        )
      );
    } catch (err: any) {
      //codeql[js/xss-through-exception]
      res.send(
        getHtml(
          'Password reset error',
          `
      <h3>The password couldn't be changed: ${err.message ?? 'unknown error'}</h3>
    `
        )
      );
    }
  },
];
