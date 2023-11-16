import { type Injector } from 'graphql-modules';
import type { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import AccountsPassword from '../accounts-password';

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
  const userAgent = 'userAgent';
  const ip = 'ip';
  req.infos = {
    userAgent,
    ip,
  };
  next();
};

export const verifyEmail =
  (accountsPasswordOrInjector: Injector | AccountsPassword) =>
  async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      if (token == null) {
        throw new Error('Token is missing');
      }
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
  };

export const resetPassword =
  (accountsPasswordOrInjector: Injector | AccountsPassword) =>
  async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      if (token == null) {
        throw new Error('Token is missing');
      }
      if (newPassword == null) {
        throw new Error('New password is missing');
      }
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
  };

export const resetPasswordForm = (req: Request, res: Response): Response =>
  res.send(
    getHtml(
      'Reset password',
      `
    <div class="container">
    <h1>Reset your password</h1>
    <form action="/resetPassword" method="POST">
      <input type="hidden" name="token" value=${validator.escape(req.params.token)} />
      <div class="form-group">
        <label for="newPassword">New password</label>
        <input type="text" class="form-control" id="newPassword" value="" placeholder="Enter your new password" name="newPassword">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  `
    )
  );
