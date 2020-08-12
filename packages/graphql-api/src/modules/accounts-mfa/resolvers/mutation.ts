import { ModuleContext } from '@graphql-modules/core';
import { AccountsMfa } from '@accounts/mfa';
import { AccountsModuleContext } from '../../accounts';
import { MutationResolvers } from '../../../models';

export const Mutation: MutationResolvers<ModuleContext<AccountsModuleContext>> = {
  challenge: async (_, { mfaToken, authenticatorId }, { injector, ip, userAgent }) => {
    const challengeResponse = await injector
      .get(AccountsMfa)
      .challenge(mfaToken, authenticatorId, { ip, userAgent });
    return challengeResponse;
  },
  associate: async (_, { type, params }, { injector, user, ip, userAgent }) => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const associateResponse = await injector
      .get(AccountsMfa)
      .associate(userId, type, params, { ip, userAgent });
    return associateResponse;
  },
  associateByMfaToken: async (_, { mfaToken, type, params }, { injector, ip, userAgent }) => {
    const associateResponse = await injector
      .get(AccountsMfa)
      .associateByMfaToken(mfaToken, type, params, { ip, userAgent });
    return associateResponse;
  },
};
