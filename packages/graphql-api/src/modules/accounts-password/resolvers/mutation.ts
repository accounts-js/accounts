import { ModuleContext } from '@graphql-modules/core';
import { CreateUserServicePassword } from '@accounts/types';
import { AccountsPassword } from '@accounts/password';
import { AccountsServer } from '@accounts/server';
import { AccountsModuleContext } from '../../accounts';
import { MutationResolvers } from '../../../models';

export const Mutation: MutationResolvers<ModuleContext<AccountsModuleContext>> = {
  addEmail: async (_, { newEmail }, { user, injector }) => {
    if (!(user && user.id)) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;
    await injector.get(AccountsPassword).addEmail(userId, newEmail);
    return null;
  },
  changePassword: async (_, { oldPassword, newPassword }, { user, injector }) => {
    if (!(user && user.id)) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;
    await injector.get(AccountsPassword).changePassword(userId, oldPassword, newPassword);
    return null;
  },
  createUser: async (_, { user }, ctx) => {
    const { ip, userAgent, injector } = ctx;
    const accountsServer = injector.get(AccountsServer);
    const accountsPassword = injector.get(AccountsPassword);

    const userId = await accountsPassword.createUser(user as CreateUserServicePassword);

    if (!accountsServer.options.enableAutologin) {
      return {
        userId: accountsServer.options.ambiguousErrorMessages ? null : userId,
      };
    }

    // When initializing AccountsServer we check that enableAutologin and ambiguousErrorMessages options
    // are not enabled at the same time

    const createdUser = await accountsServer.findUserById(userId);

    // If we are here - user must be created successfully
    // Explicitly saying this to Typescript compiler
    const loginResult = await accountsServer.loginWithUser(createdUser!, {
      ip,
      userAgent,
    });

    return {
      userId,
      loginResult,
    };
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
  twoFactorUnset: async (_, { code }, { user, injector }) => {
    // Make sure user is logged in
    if (!(user && user.id)) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;

    await injector.get(AccountsPassword).twoFactor.unset(userId, code);
    return null;
  },
  resetPassword: async (_, { token, newPassword }, { injector, ip, userAgent }) => {
    return injector.get(AccountsPassword).resetPassword(token, newPassword, { ip, userAgent });
  },
  sendResetPasswordEmail: async (_, { email }, { injector }) => {
    await injector.get(AccountsPassword).sendResetPasswordEmail(email);
    return null;
  },
  verifyEmail: async (_, { token }, { injector }) => {
    await injector.get(AccountsPassword).verifyEmail(token);
    return null;
  },
  sendVerificationEmail: async (_, { email }, { injector }) => {
    await injector.get(AccountsPassword).sendVerificationEmail(email);
    return null;
  },
};
