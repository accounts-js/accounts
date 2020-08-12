import { providerCallback } from './endpoints/oauth/provider-callback';
import { resetPassword, sendResetPasswordEmail } from './endpoints/password/reset';
import { verifyEmail, sendVerificationEmail } from './endpoints/password/verify-email';
import * as express from 'express';
import * as requestIp from 'request-ip';
import { AccountsServer } from '@accounts/server';
import { refreshAccessToken } from './endpoints/refresh-access-token';
import { getUser } from './endpoints/get-user';
import { impersonate } from './endpoints/impersonate';
import { logout } from './endpoints/logout';
import { serviceAuthenticate } from './endpoints/service-authenticate';
import { serviceVerifyAuthentication } from './endpoints/verify-authentication';
import { registerPassword } from './endpoints/password/register';
import { twoFactorSecret, twoFactorSet, twoFactorUnset } from './endpoints/password/two-factor';
import { changePassword } from './endpoints/password/change-password';
import { addEmail } from './endpoints/password/add-email';
import { userLoader } from './user-loader';
import { AccountsExpressOptions } from './types';
import { getUserAgent } from './utils/get-user-agent';
import { challenge } from './endpoints/mfa/challenge';
import { authenticators, authenticatorsByMfaToken } from './endpoints/mfa/authenticators';
import { associate, associateByMfaToken } from './endpoints/mfa/associate';

const defaultOptions: AccountsExpressOptions = {
  path: '/accounts',
};

const accountsExpress = (
  accountsServer: AccountsServer,
  options: AccountsExpressOptions = {}
): express.Router => {
  options = { ...defaultOptions, ...options };
  let { path } = options;

  // Stop invalid double slash root path
  if (path === '/') {
    path = '';
  }

  const router = express.Router();

  /**
   * Middleware to populate the user agent and ip.
   */
  router.use((req, _, next) => {
    const userAgent = getUserAgent(req);
    const ip = requestIp.getClientIp(req)!;
    req.infos = {
      userAgent,
      ip,
    };

    next();
  });

  router.post(`${path}/impersonate`, impersonate(accountsServer));

  router.get(`${path}/user`, userLoader(accountsServer), getUser());
  router.post(`${path}/user`, userLoader(accountsServer), getUser());

  router.post(`${path}/refreshTokens`, refreshAccessToken(accountsServer));

  router.post(`${path}/logout`, userLoader(accountsServer), logout(accountsServer));

  router.post(`${path}/:service/verifyAuthentication`, serviceVerifyAuthentication(accountsServer));

  router.post(`${path}/:service/authenticate`, serviceAuthenticate(accountsServer));

  const services = accountsServer.getServices();

  // @accounts/mfa
  if (services.mfa) {
    router.post(`${path}/mfa/associate`, userLoader(accountsServer), associate(accountsServer));

    router.post(`${path}/mfa/associateByMfaToken`, associateByMfaToken(accountsServer));

    router.get(
      `${path}/mfa/authenticators`,
      userLoader(accountsServer),
      authenticators(accountsServer)
    );

    router.get(`${path}/mfa/authenticatorsByMfaToken`, authenticatorsByMfaToken(accountsServer));

    router.post(`${path}/mfa/challenge`, challenge(accountsServer));
  }

  // @accounts/password
  if (services.password) {
    router.post(`${path}/password/register`, registerPassword(accountsServer));

    router.post(`${path}/password/verifyEmail`, verifyEmail(accountsServer));

    router.post(`${path}/password/resetPassword`, resetPassword(accountsServer));

    router.post(`${path}/password/sendVerificationEmail`, sendVerificationEmail(accountsServer));

    router.post(`${path}/password/sendResetPasswordEmail`, sendResetPasswordEmail(accountsServer));

    router.post(`${path}/password/addEmail`, userLoader(accountsServer), addEmail(accountsServer));

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
