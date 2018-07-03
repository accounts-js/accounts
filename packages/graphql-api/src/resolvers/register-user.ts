import { AccountsServer } from '@accounts/server';
import { AccountsPassword, PasswordCreateUserType } from '@accounts/password';
import { MutationResolvers } from '../types/graphql';

export const registerPassword = (
  accountsServer: AccountsServer
): MutationResolvers.RegisterResolver => async (_: null, args) => {
  const { user } = args;

  const password = accountsServer.getServices().password as AccountsPassword;

  if (!(typeof password.createUser === 'function')) {
    throw new Error('No service handle password registration.');
  }

  const userId = await password.createUser(user as PasswordCreateUserType);

  return userId;
};
