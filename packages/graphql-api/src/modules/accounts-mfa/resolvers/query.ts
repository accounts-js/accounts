import { ModuleContext } from '@graphql-modules/core';
import { AccountsMfa } from '@accounts/mfa';
import { QueryResolvers } from '../../../models';
import { AccountsModuleContext } from '../../accounts';

export const Query: QueryResolvers<ModuleContext<AccountsModuleContext>> = {
  authenticators: async (_, __, { user, injector }) => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('Unauthorized');
    }

    return injector.get(AccountsMfa).findUserAuthenticators(userId);
  },
  authenticatorsByMfaToken: async (_, { mfaToken }, { injector }) => {
    return injector.get(AccountsMfa).findUserAuthenticatorsByMfaToken(mfaToken);
  },
};
