import { ModuleContext } from '@graphql-modules/core';
import { AccountsServer } from '@accounts/server';
import { AccountsModuleContext } from '../../accounts';
import { MutationResolvers } from '../../../models';

export const Mutation: MutationResolvers<ModuleContext<AccountsModuleContext>> = {
  challenge: async (_, { mfaToken, authenticatorId }, { injector, ip, userAgent }) => {
    const challengeResponse = await injector
      .get(AccountsServer)
      .mfa.challenge(mfaToken, authenticatorId, { ip, userAgent });
    return challengeResponse;
  },
  associate: async (_, { type, params }, { injector, user, ip, userAgent }) => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const associateResponse = await injector
      .get(AccountsServer)
      .mfa.associate(userId, type, params, { ip, userAgent });
    return associateResponse;
  },
  associateByMfaToken: async (_, { mfaToken, type, params }, { injector, ip, userAgent }) => {
    const associateResponse = await injector
      .get(AccountsServer)
      .mfa.associateByMfaToken(mfaToken, type, params, { ip, userAgent });
    return associateResponse;
  },
};
