import { QueryResolvers } from '../../../types';
import { ModuleContext } from '@graphql-modules/core';
import { IAccountsModuleContext } from '..';

export const Query: QueryResolvers.Resolvers<ModuleContext<IAccountsModuleContext>> = {
  getUser: async (_, __, context) => {
    return context.user as any;
  },
};
