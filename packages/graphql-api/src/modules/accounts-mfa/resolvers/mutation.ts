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
};
