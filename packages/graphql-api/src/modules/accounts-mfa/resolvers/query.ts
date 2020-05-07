import { ModuleContext } from '@graphql-modules/core';
import { AccountsServer } from '@accounts/server';
import { QueryResolvers } from '../../../models';
import { AccountsModuleContext } from '../../accounts';

export const Query: QueryResolvers<ModuleContext<AccountsModuleContext>> = {
  authenticators: async (_, __, { user, injector }) => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('Unauthorized');
    }

    return injector.get(AccountsServer).mfa.findUserAuthenticators(userId);
  },
  authenticatorsByMfaToken: async (_, { mfaToken }, { injector }) => {
    return injector.get(AccountsServer).mfa.findUserAuthenticatorsByMfaToken(mfaToken);
  },
};
