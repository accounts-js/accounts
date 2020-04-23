import { ModuleContext } from '@graphql-modules/core';
import { AccountsServer } from '@accounts/server';
import { QueryResolvers } from '../../../models';
import { AccountsModuleContext } from '../../accounts';

export const Query: QueryResolvers<ModuleContext<AccountsModuleContext>> = {
  authenticators: async (_, { mfaToken }, { user, injector }) => {
    const userId = user?.id;
    if (!mfaToken && !userId) {
      throw new Error('Unauthorized');
    }

    const userAuthenticators = mfaToken
      ? await injector.get(AccountsServer).mfa.findUserAuthenticatorsByMfaToken(mfaToken)
      : await injector.get(AccountsServer).mfa.findUserAuthenticators(userId!);
    return userAuthenticators;
  },
};
