import { MutationResolvers } from '../../../types';
import { ModuleContext } from '@graphql-modules/core';
import { AccountsModuleContext } from '../../accounts';
import { AccountsPassword, PasswordCreateUserType } from '@accounts/password';

export const Mutation: MutationResolvers.Resolvers<ModuleContext<AccountsModuleContext>> = {
  changePassword: async (_, { oldPassword, newPassword }, { user, injector }) => {
    if (!(user && user.id)) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;
    await injector.get(AccountsPassword).changePassword(userId, oldPassword, newPassword);
    return null;
  },
  createUser: async (_: null, { user }, { injector }) => {
    const userId = await injector.get(AccountsPassword).createUser(user as PasswordCreateUserType);
    return userId;
  },
  twoFactorSet: async (_, { code, secret }, { user, injector }) => {
    // Make sure user is logged in
    if (!(user && user.id)) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;

    await injector.get(AccountsPassword).twoFactor.set(userId, secret as any, code);
    return null;
  },
  twoFactorUnset: async (_: null, { code }, { user, injector }) => {
    // Make sure user is logged in
    if (!(user && user.id)) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;

    await injector.get(AccountsPassword).twoFactor.unset(userId, code);
    return null;
  },
  resetPassword: async (_: null, { token, newPassword }, { injector }) => {
    await injector.get(AccountsPassword).resetPassword(token, newPassword);
    return null;
  },
  sendResetPasswordEmail: async (_: null, { email }, { injector }) => {
    await injector.get(AccountsPassword).sendResetPasswordEmail(email);
    return null;
  },
  verifyEmail: async (_, { token }, { injector }) => {
    await injector.get(AccountsPassword).verifyEmail(token);
    return null;
  },
  sendVerificationEmail: async (_: null, { email }, { injector }) => {
    await injector.get(AccountsPassword).sendVerificationEmail(email);
    return null;
  },
};
