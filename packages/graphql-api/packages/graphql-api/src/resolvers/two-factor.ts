import { IResolverContext } from '../types/graphql';
import AccountsServer from '@accounts/server';
import { AccountsPassword } from '@accounts/password';

export const twoFactorSecret = (accountsServer: AccountsServer) => async (
  _,
  args: {},
  ctx: IResolverContext
) => {
  const { user } = ctx;

  // Make sure user is logged in
  if (!(user && user.id)) {
    throw new Error('Unauthorized');
  }

  const password: any = accountsServer.getServices().password as AccountsPassword;

  if (!(typeof password.resetPassword === 'function')) {
    throw new Error('No service handle password modification.');
  }

  // https://github.com/speakeasyjs/speakeasy/blob/master/index.js#L517
  const secret = password.twoFactor.getNewAuthSecret();
  return secret;
};

export const twoFactorSet = (accountsServer: AccountsServer) => async (
  _,
  args: GQL.ITwoFactorSetOnMutationArguments,
  ctx: IResolverContext
) => {
  const { code, secret } = args;
  const { user } = ctx;

  // Make sure user is logged in
  if (!(user && user.id)) {
    throw new Error('Unauthorized');
  }

  const userId = user.id;
  const password: any = accountsServer.getServices().password as AccountsPassword;

  if (!(password && password.twoFactor && typeof password.twoFactor.set === 'function')) {
    throw new Error('No service handle set two factor.');
  }

  return password.twoFactor.set(userId, secret, code);
};

export const twoFactorUnset = (accountsServer: AccountsServer) => async (
  _,
  args: GQL.ITwoFactorUnsetOnMutationArguments,
  ctx: IResolverContext
) => {
  const { code } = args;
  const { user } = ctx;

  // Make sure user is logged in
  if (!(user && user.id)) {
    throw new Error('Unauthorized');
  }

  const userId = user.id;
  const password: any = accountsServer.getServices().password as AccountsPassword;

  if (!(password && password.twoFactor && typeof password.twoFactor.unset === 'function')) {
    throw new Error('No service handle two factor.');
  }

  await password.twoFactor.unset(userId, code);
};
