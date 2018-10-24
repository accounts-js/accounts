import { AccountsServer } from '@accounts/server';
import { AccountsPassword, PasswordCreateUserType } from '@accounts/password';
import { MutationResolvers } from '../types/graphql';

export const createUser = (
  accountsServer: AccountsServer
): MutationResolvers.CreateUserResolver => async (_: null, args) => {
  const { user } = args;

  const password = accountsServer.getServices().password as AccountsPassword;

  const userId = await password.createUser(user as PasswordCreateUserType);
  return userId;
};
