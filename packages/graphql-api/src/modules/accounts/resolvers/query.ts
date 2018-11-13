import { QueryResolvers } from '../../../types';
import { ModuleContext } from '@graphql-modules/core';
import { AccountsModuleContext } from '..';

export const Query: QueryResolvers.Resolvers<ModuleContext<AccountsModuleContext>> = {
  getUser: async (_, __, context) => {
    return context.user as any;
  },
};
