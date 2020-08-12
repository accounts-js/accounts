import { ModuleContext } from '@graphql-modules/core';
import { AccountsMfa } from '@accounts/mfa';
import { AccountsModuleContext } from '../../accounts';
import { MutationResolvers } from '../../../models';

export const Mutation: MutationResolvers<ModuleContext<AccountsModuleContext>> = {
  challenge: async (_, { mfaToken, authenticatorId }, { injector, infos }) => {
    const challengeResponse = await injector
      .get(AccountsMfa)
      .challenge(mfaToken, authenticatorId, infos);
    return challengeResponse;
  },
  associate: async (_, { type, params }, { injector, user, infos }) => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const associateResponse = await injector
      .get(AccountsMfa)
      .associate(userId, type, params, infos);
    return associateResponse;
  },
  associateByMfaToken: async (_, { mfaToken, type, params }, { injector, infos }) => {
    const associateResponse = await injector
      .get(AccountsMfa)
      .associateByMfaToken(mfaToken, type, params, infos);
    return associateResponse;
  },
};
