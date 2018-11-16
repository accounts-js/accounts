import { QueryResolvers } from '../../../types';
import { ModuleContext } from '@graphql-modules/core';
import { AccountsModuleContext } from '..';

export const Query: QueryResolvers.Resolvers<ModuleContext<AccountsModuleContext>> = {
  getUser: (_, __, context) => context.user || null,
};
