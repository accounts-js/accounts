import { ModuleContext } from '@graphql-modules/core';
import { AccountsToken, RequestLoginTokenErrors } from '@accounts/token';
import { AccountsServer, AccountsJsError } from '@accounts/server';
import { AccountsModuleContext } from '../../accounts';
import { MutationResolvers } from '../../../models';

export const Mutation: MutationResolvers<ModuleContext<AccountsModuleContext>> = {
  requestLoginToken: async (_, { email }, { injector }) => {
    const accountsServer = injector.get(AccountsServer);
    const accountsToken = injector.get(AccountsToken);

    try {
      await accountsToken.requestLoginToken(email);
    } catch (error) {
      // If ambiguousErrorMessages is true,
      // to prevent user enumeration we fail silently in case there is no user attached to this email
      if (
        accountsServer.options.ambiguousErrorMessages &&
        error instanceof AccountsJsError &&
        error.code === RequestLoginTokenErrors.UserNotFound
      ) {
        return null;
      }
      throw error;
    }

    return null;
  },
};
