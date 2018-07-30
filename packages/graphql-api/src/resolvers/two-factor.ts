import AccountsServer from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { IResolverContext } from '../types';
import { QueryResolvers, MutationResolvers } from '../types/graphql';

export const twoFactorSecret = (
  accountsServer: AccountsServer
): QueryResolvers.TwoFactorSecretResolver => async (_, args, ctx: IResolverContext) => {
  const { user } = ctx;

  // Make sure user is logged in
  if (!(user && user.id)) {
    throw new Error('Unauthorized');
  }

  const password = accountsServer.getServices().password as AccountsPassword;

  // https://github.com/speakeasyjs/speakeasy/blob/master/index.js#L517
  const secret = password.twoFactor.getNewAuthSecret();
  return secret;
};

export const twoFactorSet = (
  accountsServer: AccountsServer
): MutationResolvers.TwoFactorSetResolver => async (_, args, ctx: IResolverContext) => {
  const { code, secret } = args;
  const { user } = ctx;

  // Make sure user is logged in
  if (!(user && user.id)) {
    throw new Error('Unauthorized');
  }

  const userId = user.id;
  const password = accountsServer.getServices().password as AccountsPassword;

  await password.twoFactor.set(userId, secret as any, code);
  return null;
};

export const twoFactorUnset = (
  accountsServer: AccountsServer
): MutationResolvers.TwoFactorUnsetResolver => async (_: null, args, ctx: IResolverContext) => {
  const { code } = args;
  const { user } = ctx;

  // Make sure user is logged in
  if (!(user && user.id)) {
    throw new Error('Unauthorized');
  }

  const userId = user.id;
  const password = accountsServer.getServices().password as AccountsPassword;

  await password.twoFactor.unset(userId, code);
  return null;
};
