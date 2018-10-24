import { providerCallback } from './endpoints/oauth/provider-callback';
import { resetPassword, sendResetPasswordEmail } from './endpoints/password/reset';
import { verifyEmail, sendVerificationEmail } from './endpoints/password/verify-email';
import * as express from 'express';
import { AccountsServer } from '@accounts/server';
import { refreshAccessToken } from './endpoints/refresh-access-token';
import { getUser } from './endpoints/get-user';
import { impersonate } from './endpoints/impersonate';
import { logout } from './endpoints/logout';
import { serviceAuthenticate } from './endpoints/service-authenticate';
import { registerPassword } from './endpoints/password/register';
import { twoFactorSecret, twoFactorSet, twoFactorUnset } from './endpoints/password/two-factor';
import { changePassword } from './endpoints/password/change-password';
import { userLoader } from './user-loader';
import { AccountsExpressOptions } from './types';

const defaultOptions: AccountsExpressOptions = {
  path: '/accounts',
};

const accountsExpress = (
  accountsServer: AccountsServer,
  options: AccountsExpressOptions = {}
): express.Router => {
  options = { ...defaultOptions, ...options };
  const { path } = options;

  const router = express.Router();

  router.post(`${path}/impersonate`, impersonate(accountsServer));

  router.post(`${path}/user`, userLoader(accountsServer), getUser(accountsServer));

  router.post(`${path}/refreshTokens`, refreshAccessToken(accountsServer));

  router.post(`${path}/logout`, userLoader(accountsServer), logout(accountsServer));

  router.post(`${path}/:service/authenticate`, serviceAuthenticate(accountsServer));

  const services = accountsServer.getServices();

  // @accounts/password
  if (services.password) {
    router.post(`${path}/password/register`, registerPassword(accountsServer));

    router.post(`${path}/password/verifyEmail`, verifyEmail(accountsServer));

    router.post(`${path}/password/resetPassword`, resetPassword(accountsServer));

    router.post(`${path}/password/sendVerificationEmail`, sendVerificationEmail(accountsServer));

    router.post(`${path}/password/sendResetPasswordEmail`, sendResetPasswordEmail(accountsServer));

    router.post(
      `${path}/password/changePassword`,
      userLoader(accountsServer),
      changePassword(accountsServer)
    );

    router.post(
      `${path}/password/twoFactorSecret`,
      userLoader(accountsServer),
      twoFactorSecret(accountsServer)
    );

    router.post(
      `${path}/password/twoFactorSet`,
      userLoader(accountsServer),
      twoFactorSet(accountsServer)
    );

    router.post(
      `${path}/password/twoFactorUnset`,
      userLoader(accountsServer),
      twoFactorUnset(accountsServer)
    );
  }

  // @accounts/oauth
  if (services.oauth) {
    router.get(`${path}/oauth/:provider/callback`, providerCallback(accountsServer, options));
  }

  return router;
};

export default accountsExpress;
