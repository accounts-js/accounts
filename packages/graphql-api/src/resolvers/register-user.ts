import { AccountsServer } from '@accounts/server';
import { IResolverContext } from '../types/graphql';
import { AccountsPassword, PasswordCreateUserType } from '@accounts/password';

export const registerPassword = (accountsServer: AccountsServer) => async (
  _: null,
  args: GQL.IRegisterOnMutationArguments,
  ctx: IResolverContext
) => {
  const { user } = args;

  const password = accountsServer.getServices().password as AccountsPassword;

  if (!(typeof password.createUser === 'function')) {
    throw new Error('No service handle password registration.');
  }

  const userId = await password.createUser(user as PasswordCreateUserType);

  return userId;
};
